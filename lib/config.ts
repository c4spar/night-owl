import { DocSearchConfig } from "../components/docsearch.tsx";
import { NavItemOptions } from "../components/header.tsx";
import { NotFoundOptions } from "../components/not_found.tsx";
import {
  basename,
  bold,
  deepMerge,
  dirname,
  join,
  log,
  parseYaml,
  Theme,
} from "../deps.ts";
import { ProviderOptions } from "./provider.ts";
import { FileOptions, getFiles } from "./resource.ts";
import { SourceFile } from "./source_file.ts";
import { pathToUrl } from "./utils.ts";

export interface NavOptions {
  collapse?: boolean;
  items?: Array<NavItemOptions>;
}

export interface Script {
  url: string;
  contentType: string;
}

export interface SourceFilesOptions extends FileOptions {
  label?: string;
  pattern?: RegExp;
}

export interface CreateConfigOptions<O> {
  repository?: string;
  src?: string | Array<string | SourceFilesOptions>;
  rev?: string;
  name?: string;
  pagesDropdown?: boolean;
  versions?: Array<string> | boolean;
  pages?: boolean;
  nav?: NavOptions;
  notFound?: (props: NotFoundOptions) => unknown;
  background?: () => unknown;
  providers?: Array<ProviderOptions<O>>;
  sanitize?: (file: SourceFile) => string;
  theme?: Partial<Theme>;
  scripts?: Record<string, Script>;
  toc?: string | TocTree;
  docSearch?: DocSearchConfig;
}

export interface AppConfig
  extends Omit<CreateConfigOptions<unknown>, "versions"> {
  src: string | Array<string | SourceFilesOptions>;
  rev: string;
  name: string;
  sourceFiles: Array<SourceFile>;
  toc?: Toc;
  docSearch?: DocSearchConfig;
}

export type Toc = Record<string, string>;

export type TocTree = {
  [route: string]: string | TocItem;
};

export type TocItem = {
  name: string;
  children?: TocTree;
};

export async function createConfig<O>(
  options: CreateConfigOptions<O>,
  req: Request,
): Promise<AppConfig> {
  const opts = {
    src: "./",
    rev: "main",
    name: "Night Owl",
    ...options,
  };
  const src = typeof opts.src === "string" ? [opts.src] : opts.src;
  const {sourceFiles, toc} = await fetchSourceFiles(src, req, opts);
  
  return {
    ...opts,
    sourceFiles,
    toc,
  };
}

async function fetchSourceFiles<O>(
  src: Array<string | SourceFilesOptions>,
  req: Request,
  opts: CreateConfigOptions<O>,
): Promise<{ sourceFiles: Array<SourceFile<O>>, toc?: Toc}> {
  log.info(bold("Fetching resources:"), src);

  const now = Date.now();
  const files: Array<[Array<SourceFile<O>>, SourceFilesOptions, Toc?]> = await Promise.all(
    src.map((path: string | SourceFilesOptions) =>
      Promise.all([
        getFiles(path, {
          recursive: true,
          includeDirs: true,
          loadAssets: true,
          pattern: typeof path !== "string" && path.pattern ||
            /\.(md|js|jsx|ts|tsx)$/,
          read: true,
          req,
          pages: opts.pages,
          providers: opts.providers,
          versions: opts.versions ?? true,
        }),
        typeof path === "string" ? { src: path } : path,
        getToc(path, opts, req),
      ])
    ),
  );

  let toc: Toc | undefined = undefined;
  let sourceFiles: Array<SourceFile<O>> = [];

  for (const [source, sourceOpts, tocToc] of files) {
    prepareIndexPage(source, sourceOpts);
    sourceFiles.push(...source);

    if (tocToc) {
      toc = mergeToc(sourceOpts, tocToc, toc);
    }
  }

  log.debug("toc: %O", toc);

  if (toc) {
    sourceFiles = extractTocFiles(toc, sourceFiles);
  }

  log.info(
    bold("%s Resources fetched in: %s"),
    sourceFiles.length,
    (Date.now() - now).toString() + "ms",
  );
  
  return {sourceFiles, toc};
}

async function getToc<T>(
  path: string | SourceFilesOptions,
  opts: CreateConfigOptions<T>,
  req: Request,
) {
  log.debug("Get toc:", path);
  let toc: TocTree | undefined;

  if (opts.toc && typeof opts.toc !== "string") {
    toc = opts.toc;
  } else {
    let pattern: RegExp;
    if (typeof opts.toc === "string") {
      path = dirname(opts.toc);
      pattern = new RegExp(`${basename(opts.toc).replace(".", "\.")}$`);
    } else {
      pattern = /toc\.(yml|yaml|json)$/;
    }

    const [file] = await getFiles(
      typeof path === "string"
        ? path
        : { ...path, component: undefined, file: undefined },
      {
        read: true,
        repository: opts.repository,
        pattern,
        req,
        versions: true,
      },
    );

    if (file) {
      toc = file.path.endsWith(".json")
        ? JSON.parse(file.content)
        : parseYaml(file.content);
    }
  }

  return toc && flatToc(toc);
}

/** Exclude readme if index file exists. */
function prepareIndexPage<O>(
  source: Array<SourceFile<O>>,
  sourceOpts: SourceFilesOptions,
): void {
  const readmeIndex = source.findIndex((file) =>
    file.fileName === "README.md" &&
    file.routePrefix === "/" &&
    (!sourceOpts.prefix || sourceOpts.prefix === file.route)
  );
  const indexIndex = source.findIndex((file) =>
    file.fileName.match(/^index\.(md|js|jsx|ts|tsx)$/) &&
    file.routePrefix === "/" &&
    (!sourceOpts.prefix || sourceOpts.prefix === file.route)
  );
  if (readmeIndex !== -1 && indexIndex !== -1) {
    source.splice(readmeIndex, 1);
  }
}

function mergeToc(sourceOpts: SourceFilesOptions, tocToc: Toc, toc?: Toc): Toc {
  if (sourceOpts.prefix) {
    const tocTmp: Toc = {};
    for (const [path, entry] of Object.entries(tocToc)) {
      tocTmp[join("/", sourceOpts.prefix, path).replace(/\/$/, "")] = entry;
    }
    tocToc = tocTmp;
  }

  if (sourceOpts.label) {
    const key = Object.keys(tocToc)[0] as keyof typeof tocToc;
    tocToc[key] = sourceOpts.label;
  }

  return deepMerge(toc ?? {}, tocToc ?? {});
}

function extractTocFiles<O>(toc: Toc, sourceFiles: Array<SourceFile<O>>): Array<SourceFile<O>> {
  const filesTmp: Array<SourceFile<O>> = [];
  for (const [route, name] of Object.entries(toc)) {
    const matchedFiles = sourceFiles.filter((file) =>
      file.mainRoute === route,
    );
    if (!matchedFiles.length) {
      log.error(`Table of content file not found: ${route} -> ${name}`, matchedFiles, sourceFiles);
      throw new Error(`Table of content file not found: ${route} -> ${name}`);
    }
    for (const file of matchedFiles) {
      file.name = name;
      filesTmp.push(file);
    }
  }
  return filesTmp;
}

function flatToc(
  toc: TocTree,
  prefix = "",
  routes: Record<string, string> = {},
) {
  for (const [path, nameOrItem] of Object.entries(toc)) {
    const route = pathToUrl("/", prefix, path);
    const item = typeof nameOrItem === "string"
      ? { name: nameOrItem }
      : nameOrItem;
    routes[route] = item.name;
    if (item.children) {
      flatToc(item.children, route, routes);
    }
  }
  return routes;
}

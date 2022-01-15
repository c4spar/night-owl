import { NavItemOptions } from "../components/header.tsx";
import { NotFoundOptions } from "../components/not_found.tsx";
import {
  basename,
  bold,
  deepMerge,
  dirname,
  log,
  parseYaml,
  Theme,
} from "../deps.ts";
import { ProviderOptions } from "./provider.ts";
import { getFiles, SourceFilesOptions } from "./resource.ts";
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

export interface CreateConfigOptions<O> {
  repository?: string;
  src?: string | Array<string | SourceFilesOptions>;
  rev?: string;
  label?: unknown;
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
}

export interface AppConfig
  extends Omit<CreateConfigOptions<unknown>, "versions"> {
  src: string | Array<string | SourceFilesOptions>;
  rev: string;
  label: unknown;
  sourceFiles: Array<SourceFile>;
  toc?: Toc;
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
    label: "Nano Deploy",
    ...options,
  };

  const now = Date.now();
  log.info(bold("Fetching resources..."));

  const src = typeof opts.src === "string" ? [opts.src] : opts.src;
  let toc: Toc | undefined = undefined;

  const files: Array<[Toc | undefined, Array<SourceFile<O>>]> = await Promise
    .all(
      src.map((path: string | SourceFilesOptions) =>
        Promise.all([
          getToc(path, opts, req),
          getFiles(path, {
            recursive: true,
            includeDirs: true,
            loadAssets: true,
            pattern: /\.(md|js|jsx|ts|tsx)$/,
            read: true,
            req,
            repository: opts.repository,
            pages: opts.pages,
            providers: opts.providers,
            versions: opts.versions ?? true,
          }),
        ])
      ),
    );

  let sourceFiles: Array<SourceFile<O>> = [];
  for (const [tocToc, source] of files) {
    if (tocToc) {
      toc = deepMerge(toc ?? {}, tocToc ?? {});
    }
    if (source.length) {
      sourceFiles = [...sourceFiles, ...source];
    }
  }

  if (toc) {
    const filesTmp: Array<SourceFile<O>> = [];
    for (const [route, name] of Object.entries(toc)) {
      const i = sourceFiles.findIndex((file) => file.route === route);
      const file = sourceFiles[i];
      if (!file) {
        throw new Error(`Table of content file not found: ${route} -> ${name}`);
      }
      file.label = name;
      filesTmp.push(file);
    }
    sourceFiles = filesTmp;
  }

  log.info(
    bold("%s Resources fetched in: %s"),
    sourceFiles.length,
    (Date.now() - now).toString() + "ms",
  );

  return {
    ...opts,
    sourceFiles,
    toc,
  };
}

async function getToc<T>(
  path: string | SourceFilesOptions,
  opts: CreateConfigOptions<T>,
  req: Request,
) {
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

    const [file] = await getFiles(path, {
      read: true,
      repository: opts.repository,
      pattern,
      req,
    });

    if (file) {
      toc = file.path.endsWith(".json")
        ? JSON.parse(file.content)
        : parseYaml(file.content);
    }
  }

  return toc && flatToc(toc);
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

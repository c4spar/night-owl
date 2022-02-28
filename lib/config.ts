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
}

export interface AppConfig
  extends Omit<CreateConfigOptions<unknown>, "versions"> {
  src: string | Array<string | SourceFilesOptions>;
  rev: string;
  name: string;
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
    name: "Night Owl",
    ...options,
  };

  const now = Date.now();
  log.info(bold("Fetching resources..."));

  const src = typeof opts.src === "string" ? [opts.src] : opts.src;
  let toc: Toc | undefined = undefined;

  const files: Array<
    [Array<SourceFile<O>>, SourceFilesOptions]
  > = await Promise
    .all(
      src.map((path: string | SourceFilesOptions) =>
        Promise.all([
          getFiles(path, {
            recursive: true,
            includeDirs: true,
            loadAssets: true,
            pattern: /^((toc\.(yml|yaml|json))|(.+\.(md|js|jsx|ts|tsx)))$/,
            read: true,
            req,
            repository: opts.repository,
            pages: opts.pages,
            providers: opts.providers,
            versions: opts.versions ?? true,
          }),
          typeof path === "string" ? { src: path } : path,
        ])
      ),
    );

  let sourceFiles: Array<SourceFile<O>> = [];
  for (const [source, sourceOpts] of files) {
    // Exclude readme if index file exists.
    const readmeIndex = source.findIndex((file) => file.path === "/README.md");
    const indexIndex = source.findIndex((file) =>
      file.path.match(/^\/index\.(md|js|jsx|ts|tsx)$/)
    );
    if (readmeIndex !== -1 && indexIndex !== -1) {
      source.splice(readmeIndex, 1);
    }

    const tocIndex = source.findIndex((file) =>
      file.path.match(/^\/toc\.(yml|yaml|json)$/)
    );
    if (tocIndex !== -1) {
      const tocFile = source.splice(tocIndex, 1)[0];
      let tocToc: Toc = flatToc(
        tocFile.path.endsWith(".json")
          ? JSON.parse(tocFile.content)
          : parseYaml(tocFile.content),
      );

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

      toc = deepMerge(toc ?? {}, tocToc ?? {});
    }

    if (source.length) {
      sourceFiles = [...sourceFiles, ...source];
    }
  }

  log.debug("toc: %O", toc);

  if (toc) {
    const filesTmp: Array<SourceFile<O>> = [];
    for (const [route, name] of Object.entries(toc)) {
      const matchedFiles = sourceFiles.filter((file) =>
        file.mainRoute === route
      );
      if (!matchedFiles.length) {
        throw new Error(`Table of content file not found: ${route} -> ${name}`);
      }
      for (const file of matchedFiles) {
        file.name = name;
        filesTmp.push(file);
      }
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

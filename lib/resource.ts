import {
  basename,
  dirname,
  encodeBase64,
  isAbsolute,
  join,
  lookup,
} from "../deps.ts";
import { Cache } from "./cache.ts";
import {
  getVersions,
  GithubDirEntry,
  GithubVersions,
  gitReadDir,
  gitReadFile,
} from "./git.ts";
import { getMetaData } from "./page.ts";
import { ProviderFunction, ProviderOptions, ProviderType } from "./provider.ts";
import { ChildComponent } from "./types.ts";
import {
  getLabel,
  getRouteRegex,
  joinUrl,
  parseRemotePath,
  parseRoute,
  pathToUrl,
  sortByKey,
} from "./utils.ts";

export interface FileOptions {
  basePath: string;
  path: string;
  dirName: string;
  fileName: string;
  route: string;
  routePrefix: string;
  routeName: string;
  content: string;
  isDirectory: boolean;
  label: string;
  assets: Array<FileOptions>;
  component?: ChildComponent;
  versions?: GithubVersions;
  rev?: string;
  repository?: string;
}

export type GetFilesOptions<O> = ReadDirOptions<O>;

export interface ReadDirOptions<O> {
  recursive?: boolean;
  includeDirs?: boolean;
  includeFiles?: boolean;
  loadAssets?: boolean;
  pattern?: RegExp;
  read?: boolean;
  rev?: string;
  repository?: string;
  addVersion?: boolean;
  req: Request;
  versions?: GithubVersions;
  pages?: boolean;
  providers?: Array<ProviderOptions<O>>;
  prefix?: string;
}

interface InitComponentOptions<O> {
  req: Request;
  providers?: Array<ProviderOptions<O>>;
  repository?: string;
  rev?: string;
}

interface CreateFileOptions<O> extends InitComponentOptions<O> {
  isDirectory: boolean;
  addVersion?: boolean;
  basePath: string;
  read?: boolean;
  loadAssets?: boolean;
  base64?: true;
  versions?: GithubVersions;
  pages?: boolean;
  prefix?: string;
}

interface GetRoutePrefixOptions {
  basePath?: string;
  addVersion?: boolean;
  versions?: GithubVersions;
  pages?: boolean;
  rev?: string;
  prefix?: string;
}

export interface SourceFilesOptions {
  src: string;
  prefix?: string;
  repository?: string;
  rev?: string;
}

const decoder = new TextDecoder("utf8");

const getFilesCache = new Cache<Array<FileOptions>>();

const local = Deno.env.get("LOCAL") === "true";

export async function getFiles<O>(
  path: string | SourceFilesOptions,
  opts: GetFilesOptions<O>,
): Promise<Array<FileOptions>> {
  // const prefix = typeof path === "string" ? undefined : path.prefix;
  // if (typeof path !== "string") {
  //   path = path.src;
  // }

  const cacheKey = JSON.stringify({ path, opts, cacheKey: opts.req.url });

  let files = getFilesCache.get(cacheKey);
  if (files) {
    return files;
  }

  if (typeof path === "string") {
    const { repository, rev, path: filePath } = parseRemotePath(path);
    path = {
      src: filePath,
      repository,
      rev,
    };
  } else {
    const { repository, rev, path: src } = parseRemotePath(path.src);
    path.src = src;
    path.repository ??= repository;
    path.rev ??= rev;
  }

  // let { repository, rev, path: filePath } = parseRemotePath(path);
  const versionsRepo = path.repository ?? opts.repository;
  const versions: GithubVersions | undefined = !opts.versions && versionsRepo
    ? await getVersions(versionsRepo)
    : undefined;

  const { version: selectedVersion } = parseRoute(
    new URL(opts.req.url).pathname,
    versions?.all ?? [],
    opts.pages,
  );

  path.rev = selectedVersion ?? versions?.latest ?? path.rev;

  // Fetch only from local (latest deployed version) if no version is selected
  // and local is not enforced.
  if (!path.repository && !local && selectedVersion) {
    path.repository = opts.repository;
  }

  files = await readDir(path.src, {
    versions,
    addVersion: !!selectedVersion,
    ...opts,
    repository: path.repository,
    rev: path.rev,
    prefix: path.prefix,
  });

  if (!path.repository) {
    files = files.sort(sortByKey("path"));
  }

  getFilesCache.set(cacheKey, files);

  return files;
}

async function readDir<O>(
  path: string,
  opts: ReadDirOptions<O>,
  basePath: string = path,
): Promise<Array<FileOptions>> {
  const resultPromises: Array<Promise<FileOptions | Array<FileOptions>>> = [];

  for await (const dirEntry of read()) {
    if (
      opts?.pattern &&
      !dirEntry.isDirectory &&
      !opts.pattern.test(dirEntry.name)
    ) {
      continue;
    }

    if (
      dirEntry.isDirectory ? opts?.includeDirs : opts.includeFiles !== false
    ) {
      const fullPath = join(path, dirEntry.name);
      const filePromise = createFile(fullPath, {
        ...opts,
        basePath,
        isDirectory: dirEntry.isDirectory,
        prefix: opts.prefix,
      });

      if (dirEntry.isDirectory) {
        if (opts?.recursive) {
          resultPromises.push(
            readDir(
              join(path, dirEntry.name),
              opts,
              basePath,
            ).then((files) =>
              files.length
                ? filePromise.then((file) => [file, ...files])
                : files
            ),
          );
        }
      } else {
        resultPromises.push(filePromise);
      }
    }
  }

  return Promise.all(resultPromises).then((files) => files.flat());

  function read(): AsyncIterable<GithubDirEntry | Deno.DirEntry> {
    return opts.repository
      ? gitReadDir(opts.repository, opts.rev, path)
      : Deno.readDir(path);
  }
}

async function createFile<O>(
  path: string,
  opts: CreateFileOptions<O>,
): Promise<FileOptions> {
  const fileName = basename(path);
  const dirName = dirname(path);
  let routePrefix = getRoutePrefix(path, opts);
  const routeName = getRouteName(path);
  const route = joinUrl(routePrefix, routeName);
  const content = opts.read && !opts.isDirectory ? await readTextFile() : "";

  if (routePrefix === route) {
    routePrefix = "/";
  }

  const assets =
    opts.loadAssets && !opts.isDirectory && fileName.endsWith(".md")
      ? await getAssets(path, content, opts)
      : [];

  const component = !opts.isDirectory && fileName.endsWith(".tsx")
    ? await initComponent(path, opts)
    : undefined;

  const headline = fileName.endsWith(".md") &&
    (fileName.startsWith("index.") || fileName.startsWith("README.")) &&
    content.trim().match(/^#\s+([^\n]+)/)?.[1];

  let label: string;
  if (headline) {
    label = headline;
  } else if (route === "/") {
    label = getLabel(pathToUrl(fileName));
  } else if (routeName === "/") {
    label = getLabel(route.split("/").at(-1)!.split("@")[0]);
  } else {
    label = getLabel(routeName);
  }

  return {
    path,
    dirName,
    fileName,
    route,
    routePrefix,
    routeName,
    isDirectory: opts.isDirectory,
    content,
    basePath: opts.basePath,
    assets,
    component,
    label,
    versions: opts.versions,
    rev: opts.rev,
    repository: opts.repository,
  };

  async function readTextFile() {
    try {
      return opts.repository
        ? await gitReadFile(opts.repository, opts.rev!, path, opts.base64)
        : await denoReadFile(path, opts.base64);
    } catch (error: unknown) {
      throw new Error("Failed to read file: " + path, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}

export function getRoutePrefix(path: string, opts: GetRoutePrefixOptions) {
  const dirName = dirname(path);
  let routePrefix = pathToUrl("/", dirName);

  // Remove base path.
  if (opts.basePath) {
    const { path: basePath } = parseRemotePath(opts.basePath);
    const regex = new RegExp(`^${pathToUrl("/", basePath)}`);
    routePrefix = joinUrl(
      "/",
      routePrefix.replace(regex, "/"),
    );
  }

  if (opts.prefix) {
    routePrefix = joinUrl(opts.prefix, routePrefix);
  }

  // Add selected version to url.
  if (
    opts.addVersion &&
    opts.versions
  ) {
    routePrefix = routePrefix.replace(
      getRouteRegex(opts.versions.all, opts.pages),
      opts.pages ? "$3@" + opts.rev + "$6$8" : "/" + opts.rev + "$5$7",
    ).replace(/\/+$/, "");
  }

  return routePrefix || "/";
}

function getRouteName(path: string) {
  const fileName = basename(path);
  let routeName = pathToUrl("/", fileName);

  if (["/index", "/README"].includes(routeName)) {
    routeName = "/";
  }

  return routeName;
}

async function denoReadFile(path: string, base64?: boolean): Promise<string> {
  const file = await Deno.readFile(path);
  if (base64) {
    try {
      return `data:${lookup(path)};charset=utf-8;base64,${encodeBase64(file)}`;
    } catch (error: unknown) {
      throw new Error("Failed to encode base64 string: " + path, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  return decoder.decode(file);
}

function getAssets<O>(
  filePath: string,
  content: string,
  opts: CreateFileOptions<O>,
): Promise<Array<FileOptions>> {
  const imgRegex1 = /!\[[^\]]*]\(([^)]+)\)/g;
  const imgRegex2 = /!\[[^\]]*]\(([^)]+)\)/;
  const matches = content.match(imgRegex1) ?? [];
  const base = dirname(filePath);
  return Promise.all(
    matches
      .map((match): Promise<FileOptions> | null => {
        const [_, path] = match.match(imgRegex2) ?? [];
        return path.startsWith("http://") || path.startsWith("https://")
          ? null
          : createFile(join(base, path), {
            ...opts,
            base64: true,
          });
      })
      .filter((file) => file) as Array<Promise<FileOptions>>,
  );
}

function isProviderType<V extends unknown, T extends unknown>(
  p: unknown | ProviderType<V, T>,
): p is ProviderType<V, T> {
  // deno-lint-ignore no-explicit-any
  return typeof (p as any).prototype.onInit === "function";
}

async function initComponent<O>(
  path: string,
  options: InitComponentOptions<O>,
) {
  const importPath = options.repository
    ? `https://raw.githubusercontent.com/${options.repository}/${options.rev}/${path}`
    : addProtocol(path);

  const { default: component } = await import(importPath);
  const { providers } = getMetaData(component) ?? { providers: [] };

  const props = Object.assign(
    {},
    ...await Promise.all(
      providers.map(
        (
          provider:
            | ProviderType<unknown, unknown>
            | ProviderFunction<unknown, unknown>,
        ) => {
          const props =
            options.providers?.filter(({ component }) => component === provider)
              .map(({ props }) => props) ?? [];

          const opts = Object.assign({}, ...props);

          return isProviderType(provider)
            ? new provider().onInit(options.req, opts)
            : provider(options.req, opts);
        },
      ),
    ),
  );
  return { component, props };
}

function addProtocol(script: string): string {
  const hasProtocol: boolean = script.startsWith("http://") ||
    script.startsWith("https://") || script.startsWith("file://");
  if (!hasProtocol) {
    script = "file://" +
      (isAbsolute(script) ? script : join(Deno.cwd(), script));
  }
  return script;
}

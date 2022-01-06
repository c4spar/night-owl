import {
  basename,
  dirname,
  encodeBase64,
  isAbsolute,
  join,
  lookup,
} from "../deps.ts";
import { Cache } from "./cache.ts";
import { GithubDirEntry, gitReadDir, gitReadFile } from "./git.ts";
import { getMetaData } from "./page.ts";
import { ProviderFunction, ProviderOptions, ProviderType } from "./provider.ts";
import { ChildComponent } from "./types.ts";
import {
  flat,
  getLabel,
  getRouteRegex,
  joinUrl,
  parseRemotePath,
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
}

export interface GetFilesOptions<O> extends ReadDirOptions<O> {
  map?: (file: FileOptions) => FileOptions;
}

export interface ReadDirOptions<O> {
  recursive?: boolean;
  includeDirs?: boolean;
  includeFiles?: boolean;
  loadAssets?: boolean;
  pattern?: RegExp;
  read?: boolean;
  rev?: string;
  selectedVersion?: string;
  cacheKey: string;
  req: Request;
  versions?: Array<string>;
  pages?: boolean;
  providers?: Array<ProviderOptions<O>>;
}

interface InitComponentOptions<O> {
  req: Request;
  providers?: Array<ProviderOptions<O>>;
  repository?: string;
  rev?: string;
}

interface CreateFileOptions<O> extends InitComponentOptions<O> {
  isDirectory: boolean;
  selectedVersion?: string;
  basePath: string;
  read?: boolean;
  loadAssets?: boolean;
  base64?: true;
  versions?: Array<string>;
  pages?: boolean;
}

const getFilesCache = new Cache<Array<FileOptions>>();

export async function getFiles<O>(
  path: string,
  opts: GetFilesOptions<O>,
): Promise<Array<FileOptions>> {
  const cacheKey = JSON.stringify({ path, opts });

  let files: Array<FileOptions> | undefined = getFilesCache.get(cacheKey);
  if (files) {
    return files;
  }

  files = await readDir(path, opts);

  if (opts?.map) {
    files = files.map(opts.map);
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
  const { repository, rev, path: filePath } = parseRemotePath(path);
  opts.includeFiles ??= true;

  for await (const dirEntry of read()) {
    if (
      opts?.pattern &&
      !dirEntry.isDirectory &&
      !opts.pattern.test(dirEntry.name)
    ) {
      continue;
    }

    if (dirEntry.isDirectory ? opts?.includeDirs : opts?.includeFiles) {
      const fullPath = join(filePath, dirEntry.name);
      const filePromise = createFile(fullPath, {
        ...opts,
        rev: rev || opts.rev,
        repository,
        basePath,
        isDirectory: dirEntry.isDirectory,
      });

      if (dirEntry.isDirectory) {
        if (opts?.recursive) {
          resultPromises.push(
            readDir(
              join(
                repository ? (`${repository}@${rev}:${filePath}`) : path,
                dirEntry.name,
              ),
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

  const files = await Promise.all(resultPromises);

  if (repository || path !== basePath) {
    return flat(files);
  }

  return flat(files).sort(sortByKey("path"));

  function read(): AsyncIterable<GithubDirEntry | Deno.DirEntry> {
    return repository
      ? gitReadDir(repository, rev, filePath)
      : Deno.readDir(filePath);
  }
}

async function createFile<O>(
  path: string,
  opts: CreateFileOptions<O>,
): Promise<FileOptions> {
  const fileName = basename(path);
  const dirName = dirname(path);

  let routeName = pathToUrl("/", fileName);

  if (["/index", "/README"].includes(routeName)) {
    routeName = "/";
  }

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

  // Add selected version to url.
  if (opts.selectedVersion && opts.versions) {
    routePrefix = routePrefix.replace(
      getRouteRegex(opts.versions, opts.pages),
      opts.pages ? "$3@" + opts.rev + "$6$8" : "/" + opts.rev + "$5$7",
    ).replace(/\/+$/, "");
  }

  const route = joinUrl(routePrefix, routeName);
  const content = opts.read && !opts.isDirectory ? await readTextFile() : "";

  const assets =
    opts.loadAssets && !opts.isDirectory && fileName.endsWith(".md")
      ? await getAssets(path, content, opts)
      : [];

  const component = !opts.isDirectory && fileName.endsWith(".tsx")
    ? await initComponent(path, opts)
    : undefined;

  let label: string;
  if (route === routePrefix) {
    if (fileName.startsWith("index.")) {
      label = "Home";
    } else if (route === "/") {
      label = getLabel(pathToUrl(fileName));
    } else {
      label = getLabel(route.split("/").at(-1)!.split("@")[0]);
    }
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

const decoder = new TextDecoder("utf8");

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

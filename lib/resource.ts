import { join } from "https://deno.land/std@0.119.0/path/mod.ts";
import { RoutableComponent } from "../components/route.tsx";
import { basename, dirname, encodeBase64, lookup, resolve } from "../deps.ts";
import { Cache } from "./cache.ts";
import { gitReadDir, gitReadFile } from "./git.ts";
import { getMetaData } from "./page.ts";
import { ProviderFunction, ProviderType } from "./provider.ts";
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
  component?: RoutableComponent;
}

export interface ReadDirOptions {
  recursive?: boolean;
  includeDirs?: boolean;
  includeFiles?: boolean;
  loadAssets?: boolean;
  pattern?: RegExp;
  read?: boolean;
  prefix?: string;
  rev?: string;
  selectedVersion?: string;
  cacheKey: string;
  req: Request;
  versions?: Array<string>;
  pages?: boolean;
}

export interface GetFilesOptions extends ReadDirOptions {
  map?: (file: FileOptions) => FileOptions;
}

const getFilesCache = new Cache<Array<FileOptions>>();

export async function getFiles(
  path: string,
  opts: GetFilesOptions,
): Promise<Array<FileOptions>> {
  const cacheKey = JSON.stringify({ path, opts });
  opts.prefix ??= path;

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

async function readDir(
  path: string,
  opts: ReadDirOptions,
  basePath: string = path,
): Promise<Array<FileOptions>> {
  const files: Array<FileOptions | Promise<FileOptions | Array<FileOptions>>> =
    [];
  opts.includeFiles ??= true;

  const { repository, rev, path: filePath } = parseRemotePath(path);

  for await (const file of read()) {
    if (!file.isDirectory && (opts?.pattern && !opts.pattern.test(file.name))) {
      continue;
    }
    if (file.isDirectory ? opts?.includeDirs : opts?.includeFiles) {
      const fullPath = join(filePath, file.name);

      files.push(
        createFile(fullPath, {
          rev,
          ...opts,
          isDirectory: file.isDirectory,
          repository,
          basePath,
        }),
      );
    }

    if (file.isDirectory && opts?.recursive) {
      files.push(
        readDir(join(path, file.name), opts, basePath),
      );
    }
  }

  return Promise.all(files).then(
    (files) => {
      if (repository || path !== basePath) {
        return flat(files);
      }
      return flat(files).sort(sortByKey("path"));
    },
  );

  function read() {
    return repository
      ? gitReadDir(repository, rev, filePath)
      : Deno.readDir(filePath);
  }
}

interface CreateFileOptions {
  isDirectory: boolean;
  repository: string;
  rev: string;
  selectedVersion?: string;
  basePath: string;
  prefix?: string;
  read?: boolean;
  loadAssets?: boolean;
  base64?: true;
  req: Request;
  versions?: Array<string>;
  pages?: boolean;
}

async function createFile(
  path: string,
  opts: CreateFileOptions,
): Promise<FileOptions> {
  const fileName = basename(path);
  const dirName = dirname(path);

  let routeName = pathToUrl("/", fileName);

  if (["/index", "/README"].includes(routeName)) {
    routeName = "/";
  }

  let routePrefix = pathToUrl("/", dirName);

  // Replace url prefix.
  if (opts.prefix && opts.basePath) {
    const { path } = parseRemotePath(opts.prefix);
    const regex = new RegExp(`^${pathToUrl("/", path)}`);
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
    ? await initComponent(path, opts.req)
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
        ? await gitReadFile(opts.repository, opts.rev, path, opts.base64)
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

function getAssets(
  filePath: string,
  content: string,
  opts: CreateFileOptions,
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

function isProviderType<V extends unknown>(
  p: unknown | ProviderType<V>,
): p is ProviderType<V> {
  // deno-lint-ignore no-explicit-any
  return typeof (p as any).prototype.onInit === "function";
}

async function initComponent(path: string, req: Request) {
  const { default: component } = await import(resolve(path));
  const { provider } = getMetaData(component) ?? { provider: [] };
  const props = Object.assign(
    {},
    ...await Promise.all(
      provider.map((p: ProviderType<unknown> | ProviderFunction<unknown>) =>
        isProviderType(p) ? new p().onInit(req) : p(req)
      ),
    ),
  );
  return { component, props };
}

import { basename, dirname } from "../deps.ts";
import { Cache } from "./cache.ts";
import { gitReadDir, gitReadFile } from "./git.ts";
import {
  getLabel,
  joinUrl,
  parseRemotePath,
  pathToUrl,
  sortByKey,
} from "./utils.ts";

export interface FileOptions {
  path: string;
  dirName: string;
  fileName: string;
  route: string;
  routePrefix: string;
  routeName: string;
  content: string;
  isDirectory: boolean;
  label: string;
}

export interface Example extends FileOptions {
  shebang: string;
}

export interface ReadDirOptions {
  recursive?: boolean;
  includeDirs?: boolean;
  includeFiles?: boolean;
  pattern?: RegExp;
  read?: boolean;
  prefix?: string;
}

export interface GetFilesOptions extends ReadDirOptions {
  map?: (file: FileOptions) => FileOptions;
}

const getFilesCache = new Cache<Array<FileOptions>>();

export async function getFiles(
  path: string,
  opts: GetFilesOptions = {},
): Promise<Array<FileOptions>> {
  opts.prefix ??= path;
  const cacheKey = joinUrl(path, `${opts?.recursive}`, `${opts?.includeDirs}`);

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
  opts: ReadDirOptions = {},
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
      const fullPath = joinUrl(filePath, file.name);

      files.push(
        createFile(fullPath, {
          ...opts,
          isDirectory: file.isDirectory,
          repository,
          rev,
          basePath,
        }),
      );
    }

    if (file.isDirectory && opts?.recursive) {
      files.push(
        readDir(joinUrl(path, file.name), opts, basePath),
      );
    }
  }

  return Promise.all(files).then(
    (files) => files.flat().sort(sortByKey("path")),
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
  basePath: string;
  prefix?: string;
  read?: boolean;
}

async function createFile(
  path: string,
  { rev, repository, isDirectory, prefix, basePath, read }: CreateFileOptions,
): Promise<FileOptions> {
  const fileName = basename(path);
  const dirName = dirname(path);

  const routeName = pathToUrl(fileName);
  let routePrefix = pathToUrl(dirName);

  if (prefix && basePath) {
    const { path } = parseRemotePath(prefix);
    const regex = new RegExp(`^${pathToUrl(path)}`);
    routePrefix = joinUrl(
      "/docs",
      routePrefix.replace(regex, ""),
    );
  }

  const route = joinUrl(routePrefix, routeName);
  const content = read && !isDirectory ? await readTextFile() : "";

  return {
    path,
    dirName,
    fileName,
    route,
    routePrefix,
    routeName,
    isDirectory,
    content,
    label: getLabel(routeName),
  };

  function readTextFile() {
    return repository
      ? gitReadFile(repository, rev, path)
      : Deno.readTextFile(path);
  }
}

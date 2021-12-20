import { basename, dirname } from "../deps.ts";
import { Cache } from "./cache.ts";
import { pathToUrl, sortByKey } from "./utils.ts";

export interface FileOptions {
  path: string;
  dirName: string;
  fileName: string;
  route: string;
  routePrefix: string;
  routeName: string;
  content: string;
  isDirectory: boolean;
}

export interface Example extends FileOptions {
  shebang: string;
}

interface DirEntry extends Deno.DirEntry {
  path: string;
}

const getFilesCache = new Cache<Array<FileOptions>>();
const getDirNamesCache = new Cache<Array<string>>();

export async function getFiles(
  path: string,
  recursive?: boolean,
  dirs?: boolean,
): Promise<Array<FileOptions>> {
  const cacheKey = `${path}/${recursive}/${dirs}`;

  let files: Array<FileOptions> | undefined = getFilesCache.get(cacheKey);
  if (files) {
    return files;
  }
  const entries = await readDir(path, recursive, dirs);

  files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory
        ? createFile(entry.path, "", entry.isDirectory)
        : readFile(entry.path)
    ),
  );

  files.sort(sortByKey("path"));
  getFilesCache.set(cacheKey, files);

  return files;
}

export async function getDirNames(path: string): Promise<Array<string>> {
  const cacheKey = path;

  let dirNames: Array<string> | undefined = getDirNamesCache.get(cacheKey);
  if (dirNames) {
    return dirNames;
  }
  dirNames = [];

  for await (const file of Deno.readDir(path)) {
    if (file.isDirectory) {
      dirNames.push(file.name);
    }
  }

  dirNames.sort();
  getDirNamesCache.set(cacheKey, dirNames);

  return dirNames;
}

async function readDir(
  path: string,
  recursive?: boolean,
  dirs?: boolean,
): Promise<Array<DirEntry>> {
  const files: Array<DirEntry> = [];
  for await (const file of Deno.readDir(path)) {
    if (!file.isDirectory || dirs) {
      files.push({
        ...file,
        path: `${path}/${file.name}`,
        isDirectory: file.isDirectory,
      });
    }
    if (file.isDirectory && recursive) {
      files.push(...await readDir(`${path}/${file.name}`, recursive, dirs));
    }
  }
  return files.sort();
}

async function readFile(path: string): Promise<FileOptions> {
  return createFile(path, await Deno.readTextFile(path));
}

function createFile(
  path: string,
  content = "",
  isDirectory = false,
): FileOptions {
  const fileName = basename(path);
  const dirName = dirname(path);

  const routeName = pathToUrl(fileName);
  const routePrefix = pathToUrl(dirName);
  const route = routePrefix + routeName;

  return {
    path,
    dirName,
    fileName,
    route,
    routePrefix,
    routeName,
    isDirectory,
    content,
  };
}

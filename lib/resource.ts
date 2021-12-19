import { basename, dirname } from "../deps.ts";
import { pathToUrl, sortByKey } from "./utils.ts";

export interface FileOptions {
  path: string;
  dirName: string;
  fileName: string;
  route: string;
  routePrefix: string;
  routeName: string;
  content: string;
}

export interface Example extends FileOptions {
  shebang: string;
}

export interface DirEntry extends Deno.DirEntry {
  path: string;
}

export async function readDir(
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
      });
    }
    if (file.isDirectory && recursive) {
      files.push(...await readDir(`${path}/${file.name}`, recursive, dirs));
    }
  }
  return files.sort();
}

export function createFile(path: string): FileOptions {
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
    content: "",
  };
}

export async function readFile(path: string): Promise<FileOptions> {
  return {
    ...createFile(path),
    content: await Deno.readTextFile(path),
  };
}

export async function readFiles(
  path: string,
  recursive?: boolean,
  dirs?: boolean,
): Promise<Array<FileOptions>> {
  const entries = await readDir(path, recursive, dirs);
  return Promise.all(
    entries.map((entry) =>
      entry.isDirectory ? createFile(entry.path) : readFile(entry.path)
    ),
  ).then((files) => files.sort(sortByKey("path")));
}

export async function getExamples(): Promise<Array<Example>> {
  const files = await readFiles("examples");
  return files.map((file) => ({
    ...file,
    content: file.content.replace(/#!.+\n+/, ""),
    shebang: file.content.split("\n")[0],
  }));
}

export function getBenchmarks(): Promise<Array<FileOptions>> {
  return readFiles("data");
}

export function getDocs(): Promise<Array<FileOptions>> {
  return readFiles("docs", true, true);
}

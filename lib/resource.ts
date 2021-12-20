import { basename, dirname } from "../deps.ts";
import { getVersions } from "./git.ts";
import { capitalize, pathToUrl, sortByKey } from "./utils.ts";
import { Cache } from "./cache.ts";

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

function createFile(path: string, isDirectory = false): FileOptions {
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
    content: "",
  };
}

async function readFile(path: string): Promise<FileOptions> {
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
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory
        ? createFile(entry.path, entry.isDirectory)
        : readFile(entry.path)
    ),
  );
  return files.sort(sortByKey("path"));
}

export async function getDirNames(path: string): Promise<Array<string>> {
  const dirNames: Array<string> = [];
  for await (const file of Deno.readDir(path)) {
    if (file.isDirectory) {
      dirNames.push(file.name);
    }
  }
  return dirNames.sort();
}

export interface Module {
  label: string;
  name: string;
}

export interface Resources {
  benchmarks: Array<FileOptions>;
  docs: Array<FileOptions>;
  examples: Array<Example>;
  versions: Array<string>;
  modules: Array<Module>;
}

let resources: Resources | undefined;

export interface ResourceDirectories {
  benchmarks: string;
  docs: string;
  examples: string;
}

export interface ResourceOptions {
  repository: string;
  directories: ResourceDirectories;
}

export async function getResources(
  options: ResourceOptions,
): Promise<Resources> {
  if (!Cache.isEnabled() || !resources) {
    const [versions, examples, benchmarks, docs, modules] = await Promise.all([
      getVersions(options.repository),
      readFiles(options.directories.examples),
      readFiles(options.directories.benchmarks),
      readFiles(options.directories.docs, true, true),
      getDirNames(options.directories.docs),
    ]);

    resources = {
      benchmarks,
      docs,
      examples: examples.map((file) => ({
        ...file,
        content: file.content.replace(/#!.+\n+/, ""),
        shebang: file.content.split("\n")[0],
      })),
      modules: modules.map((name) => ({ name, label: capitalize(name) })),
      versions,
    };
  }

  return resources;
}

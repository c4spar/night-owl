import { getVersions, GithubVersions } from "./git.ts";
import { Example, FileOptions, getDirNames, getFiles } from "./resource.ts";
import { capitalize } from "./utils.ts";

export interface Module {
  label: string;
  name: string;
}

export interface AppDirectories {
  benchmarks: string;
  docs: string;
  examples: string;
}

export interface AppOptions {
  repository: string;
  directories?: Partial<AppDirectories>;
}

export interface AppConfig extends AppOptions {
  directories: AppDirectories;
  benchmarks: Array<FileOptions>;
  docs: Array<FileOptions>;
  examples: Array<Example>;
  versions: GithubVersions;
  modules: Array<Module>;
}

export async function createConfig(options: AppOptions): Promise<AppConfig> {
  const opts = {
    ...options,
    directories: {
      docs: "docs",
      benchmarks: "data",
      examples: "examples",
      ...options.directories,
    },
  };

  const [versions, examples, benchmarks, docs, modules] = await Promise.all([
    getVersions(opts.repository),
    getFiles(opts.directories.examples),
    getFiles(opts.directories.benchmarks),
    getFiles(opts.directories.docs, true, true, (file) => {
      const regex = new RegExp(`^\/${opts.directories.docs}`);
      file.route = file.route.replace(regex, "/docs");
      file.routePrefix = file.routePrefix.replace(regex, "/docs");
      return file;
    }),
    getDirNames(opts.directories.docs),
  ]);

  return {
    ...opts,
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

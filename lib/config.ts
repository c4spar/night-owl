import { blue, bold, log } from "../deps.ts";
import { getVersions, GithubVersions } from "./git.ts";
import { Example, FileOptions, getFiles } from "./resource.ts";

export interface AppDirectories {
  benchmarks: string;
  docs: string;
  examples: string;
}

export interface AppOptions {
  repository: string;
  rev?: string;
  selectedExample?: string;
  directories?: Partial<AppDirectories>;
}

export interface AppConfig extends AppOptions {
  rev: string;
  directories: AppDirectories;
  benchmarks: Array<FileOptions>;
  docs: Array<FileOptions>;
  examples: Array<Example>;
  versions: GithubVersions;
  modules: Array<FileOptions>;
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

  const now = Date.now();
  log.info(bold("Fetching resources..."));

  const [versions, examples, benchmarks, docs, modules] = await Promise.all([
    getVersions(opts.repository),
    getFiles(opts.directories.examples, {
      pattern: /\.ts$/,
      read: true,
    }),
    getFiles(opts.directories.benchmarks, {
      pattern: /\.json/,
      read: true,
    }),
    getFiles(opts.directories.docs, {
      recursive: true,
      includeDirs: true,
      pattern: /\.md/,
      read: true,
    }),
    getFiles(opts.directories.docs, {
      includeDirs: true,
      includeFiles: false,
    }),
  ]);

  log.info(
    bold("Resources fetched in: %s"),
    blue((Date.now() - now).toString() + "ms"),
  );

  return {
    rev: "main",
    selectedExample: examples[0]?.fileName.replace(/^\//, ""),
    ...opts,
    benchmarks,
    docs,
    examples: examples.map((file) => ({
      ...file,
      content: file.content.replace(/#!.+\n+/, ""),
      shebang: file.content.split("\n")[0],
    })),
    modules,
    versions,
  };
}

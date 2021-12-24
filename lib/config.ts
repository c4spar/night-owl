import { blue, bold, log } from "../deps.ts";
import { getVersions, GithubVersions } from "./git.ts";
import { Example, FileOptions, getFiles } from "./resource.ts";
import { matchVersion } from "./utils.ts";

export interface AppDirectories {
  benchmarks: string;
  docs: string;
  examples: string;
}

export interface AppOptions {
  repository: string;
  rev?: string;
  selectedExample?: string;
  moduleSelection?: boolean;
  versions?: Array<string>;
  directories?: Partial<AppDirectories>;
  signal?: AbortSignal;
}

export interface AppConfig extends Omit<AppOptions, "versions"> {
  rev: string;
  directories: AppDirectories;
  benchmarks: Array<FileOptions>;
  docs: Array<FileOptions>;
  examples: Array<Example>;
  versions: GithubVersions;
  modules: Array<FileOptions>;
  selectedVersion: string;
}

export async function createConfig(
  options: AppOptions,
  req: Request,
): Promise<AppConfig> {
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

  const versions = opts.versions
    ? {
      versions: opts.versions,
      tags: [],
      branches: [],
      latest: opts.versions[0],
    }
    : await getVersions(opts.repository);

  const selectedVersion = matchVersion(
    new URL(req.url).pathname,
    versions.versions,
  );
  const rev = selectedVersion ?? versions.latest;

  const [examples, benchmarks, docs, modules] = await Promise.all([
    getFiles(opts.directories.examples, {
      pattern: /\.ts$/,
      read: true,
      cacheKey: req.url,
    }),
    getFiles(opts.directories.benchmarks, {
      pattern: /\.json/,
      read: true,
      cacheKey: req.url,
    }),
    getFiles(opts.directories.docs, {
      recursive: true,
      includeDirs: true,
      loadAssets: true,
      pattern: /\.md/,
      read: true,
      cacheKey: req.url,
      rev,
      selectedVersion,
    }),
    getFiles(opts.directories.docs, {
      includeDirs: true,
      includeFiles: false,
      cacheKey: req.url,
      rev,
      selectedVersion,
    }),
  ]);

  log.info(
    bold("Resources fetched in: %s"),
    blue((Date.now() - now).toString() + "ms"),
  );

  return {
    rev: "main",
    moduleSelection: true,
    selectedVersion: rev,
    selectedExample: examples[0]?.fileName.replace(/^\//, ""),
    ...opts,
    benchmarks,
    docs,
    examples: examples.map((file) => ({
      ...file,
      content: file.content.replace(/#!.+\n+/, ""),
      shebang: file.content.split("\n")[0],
    })),
    modules: opts.moduleSelection ? modules : [],
    versions,
  };
}

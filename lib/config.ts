import { NavItemOptions } from "../components/header.tsx";
import { bold, log } from "../deps.ts";
import { getVersions, GithubVersions } from "./git.ts";
import { FileOptions, getFiles } from "./resource.ts";
import { parseRoute } from "./utils.ts";

export interface NavOptions {
  collapse?: boolean;
  items?: Array<NavItemOptions>;
}

export interface CreateConfigOptions {
  repository: string;
  src?: string | Array<FileOptions>;
  rev?: string;
  pagesDropdown?: boolean;
  versions?: Array<string>;
  pages?: boolean;
  nav?: NavOptions;
}

export interface AppConfig extends Omit<CreateConfigOptions, "versions"> {
  src: string | Array<FileOptions>;
  rev: string;
  versions: GithubVersions;
  sourceFiles: Array<FileOptions>;
  selectedVersion: string;
}

export async function createConfig(
  options: CreateConfigOptions,
  req: Request,
): Promise<AppConfig> {
  const opts = {
    src: "src/pages",
    ...options,
  };

  const now = Date.now();
  log.info(bold("Fetching resources..."));

  const versions: GithubVersions = opts.versions
    ? {
      all: opts.versions,
      tags: [],
      branches: [],
      latest: opts.versions[0],
    }
    : await getVersions(opts.repository);

  const { version: selectedVersion } = parseRoute(
    new URL(req.url).pathname,
    versions.all,
    opts.pages,
  );
  const rev = selectedVersion ?? versions.latest;

  const sourceFiles = typeof opts.src === "string"
    ? await getFiles(opts.src, {
      recursive: true,
      includeDirs: true,
      loadAssets: true,
      pattern: /\.(md|js|jsx|ts|tsx)/,
      read: true,
      cacheKey: req.url,
      rev,
      selectedVersion,
      req,
      versions: versions.all,
      pages: opts.pages,
    })
    : opts.src;

  log.info(
    bold("%s Resources fetched in: %s"),
    sourceFiles.length,
    (Date.now() - now).toString() + "ms",
  );

  return {
    rev: "main",
    selectedVersion: rev,
    ...opts,
    sourceFiles,
    versions,
  };
}

import { NavItemOptions } from "../components/header.tsx";
import { NotFoundOptions } from "../components/not_found.tsx";
import { bold, log } from "../deps.ts";
import { getVersions, GithubVersions } from "./git.ts";
import { ProviderOptions } from "./provider.ts";
import { FileOptions, getFiles } from "./resource.ts";
import { parseRoute } from "./utils.ts";

export interface NavOptions {
  collapse?: boolean;
  items?: Array<NavItemOptions>;
}

export interface CreateConfigOptions<O> {
  repository: string;
  src?: string | Array<string>;
  rev?: string;
  pagesDropdown?: boolean;
  versions?: Array<string>;
  pages?: boolean;
  nav?: NavOptions;
  notFound?: (props: NotFoundOptions) => unknown;
  background?: () => unknown;
  providers?: Array<ProviderOptions<O>>;
}

export interface AppConfig
  extends Omit<CreateConfigOptions<unknown>, "versions"> {
  src: string | Array<string>;
  rev: string;
  versions: GithubVersions;
  sourceFiles: Array<FileOptions>;
  selectedVersion: string;
}

export async function createConfig<O>(
  options: CreateConfigOptions<O>,
  req: Request,
): Promise<AppConfig> {
  const opts = {
    src: "./",
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
  const src = typeof opts.src === "string" ? [opts.src] : opts.src;

  const sourceFiles = await Promise.all(src.map((path) =>
    getFiles(path, {
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
      providers: opts.providers,
    })
  )).then((files) => files.flat());

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

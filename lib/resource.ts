import { join } from "../deps.ts";
import { Cache } from "./cache.ts";
import {
  getVersions,
  GithubDirEntry,
  GithubVersions,
  gitReadDir,
} from "./git.ts";
import { ProviderOptions } from "./provider.ts";
import { SourceFile } from "./source_file.ts";
import { parseRemotePath, parseRoute, sortByKey } from "./utils.ts";

export type GetFilesOptions<O> = ReadDirOptions<O>;

export interface ReadDirOptions<O> {
  recursive?: boolean;
  includeDirs?: boolean;
  includeFiles?: boolean;
  loadAssets?: boolean;
  pattern?: RegExp;
  read?: boolean;
  rev?: string;
  repository?: string;
  addVersion?: boolean;
  req: Request;
  versions?: GithubVersions;
  pages?: boolean;
  providers?: Array<ProviderOptions<O>>;
  prefix?: string;
}

export interface SourceFilesOptions {
  src: string;
  prefix?: string;
  repository?: string;
  rev?: string;
}

const getFilesCache = new Cache<Array<SourceFile<unknown>>>();

const local = Deno.env.get("LOCAL") === "true";

export async function getFiles<O>(
  path: string | SourceFilesOptions,
  opts: GetFilesOptions<O>,
): Promise<Array<SourceFile<O>>> {
  const cacheKey = JSON.stringify({ path, opts, cacheKey: opts.req.url });

  let files = getFilesCache.get(cacheKey);
  if (files) {
    return files;
  }

  if (typeof path === "string") {
    const { repository, rev, path: filePath } = parseRemotePath(path);
    path = {
      src: filePath,
      repository,
      rev,
    };
  } else {
    const { repository, rev, path: src } = parseRemotePath(path.src);
    path.src = src;
    path.repository ??= repository;
    path.rev ??= rev;
  }

  const versionsRepo = path.repository ?? opts.repository;
  const versions: GithubVersions | undefined = !opts.versions && versionsRepo
    ? await getVersions(versionsRepo)
    : undefined;

  const { version: selectedVersion } = parseRoute(
    new URL(opts.req.url).pathname,
    versions?.all ?? [],
    opts.pages,
  );

  path.rev = selectedVersion ?? versions?.latest ?? path.rev;

  // Fetch only from local (latest deployed version) if no version is selected
  // and local is not enforced.
  if (!path.repository && !local && selectedVersion) {
    path.repository = opts.repository;
  }

  files = await readDir(path.src, {
    versions,
    addVersion: !!selectedVersion,
    ...opts,
    repository: path.repository,
    rev: path.rev,
    prefix: path.prefix,
  });

  if (!path.repository) {
    files = files.sort(sortByKey("path"));
  }

  getFilesCache.set(cacheKey, files);

  return files;
}

async function readDir<O>(
  path: string,
  opts: ReadDirOptions<O>,
  basePath: string = path,
): Promise<Array<SourceFile<O>>> {
  const resultPromises: Array<Promise<SourceFile<O> | Array<SourceFile<O>>>> =
    [];

  for await (const dirEntry of read()) {
    if (
      opts?.pattern &&
      !dirEntry.isDirectory &&
      !opts.pattern.test(dirEntry.name)
    ) {
      continue;
    }

    if (
      dirEntry.isDirectory ? opts?.includeDirs : opts.includeFiles !== false
    ) {
      const fullPath = join(path, dirEntry.name);
      const filePromise = SourceFile.create(fullPath, {
        ...opts,
        basePath,
        isDirectory: dirEntry.isDirectory,
        prefix: opts.prefix,
      });

      if (dirEntry.isDirectory) {
        if (opts?.recursive) {
          resultPromises.push(
            readDir(
              join(path, dirEntry.name),
              opts,
              basePath,
            ).then((files) =>
              files.length
                ? filePromise.then((file) => [file, ...files])
                : files
            ),
          );
        }
      } else {
        resultPromises.push(filePromise);
      }
    }
  }

  return Promise.all(resultPromises).then((files) => files.flat());

  function read(): AsyncIterable<GithubDirEntry | Deno.DirEntry> {
    return opts.repository
      ? gitReadDir(opts.repository, opts.rev, path)
      : Deno.readDir(path);
  }
}

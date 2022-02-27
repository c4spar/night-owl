import { join } from "../deps.ts";
import {
  getVersions,
  GithubDirEntry,
  GithubVersions,
  gitReadDir,
} from "./git.ts";
import { ProviderOptions } from "./provider.ts";
import { SourceFile } from "./source_file.ts";
import { env, parseRemotePath, parseRoute, sortByKey } from "./utils.ts";

export interface GetFilesOptions<O>
  extends Omit<ReadDirOptions<O>, "versions" | "addVersion"> {
  versions?: Array<string> | boolean;
}

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
  component?: unknown;
  file?: string;
}

export interface FileOptions {
  src: string;
  component?: unknown;
  file?: string;
  prefix?: string;
  repository?: string;
  rev?: string;
}

const local = (await env("LOCAL"))?.toLowerCase() === "true";

export async function getFiles<O>(
  path: string | FileOptions,
  opts: GetFilesOptions<O>,
): Promise<Array<SourceFile<O>>> {
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

  let versions: GithubVersions | undefined;
  if (opts.versions) {
    if (Array.isArray(opts.versions)) {
      versions = {
        all: opts.versions,
        latest: opts.versions[0],
        tags: [],
        branches: [],
      };
    } else {
      const repo = path.repository ?? opts.repository;
      if (repo) {
        versions = await getVersions(repo);
      }
    }
  }

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

  const files = await readDir(path.src, {
    ...opts,
    addVersion: !!selectedVersion,
    versions,
    repository: path.repository,
    rev: path.rev,
    prefix: path.prefix,
    component: path.component,
    file: path.file,
  });

  if (path.repository) {
    return files;
  }

  return files.sort(sortByKey("path"));
}

async function readDir<O>(
  path: string,
  opts: ReadDirOptions<O>,
  basePath: string = path,
): Promise<Array<SourceFile<O>>> {
  if (opts.component || opts.file) {
    if (!opts.component || !opts.file) {
      throw new Error("Component and file option missing.");
    }
    const file = await SourceFile.create(join(path, opts.file), {
      ...opts,
      basePath,
      isDirectory: false,
      prefix: opts.prefix,
      read: false,
    });
    return [file];
  }

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

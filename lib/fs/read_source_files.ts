import { join } from "../../deps.ts";
import { SourceFile, SourceFileOptions } from "../resource/source_file.ts";
import { DistributiveOmit } from "../types.ts";
import { env, parseRemotePath, parseRoute, sortByKey } from "../utils.ts";
import { getVersions, GithubVersions } from "./git/get_versions.ts";
import { readDir } from "./read_dir.ts";
import { readSourceFile } from "./read_source_file.ts";

export type ReadSourceFilesOptions<O> =
  & DistributiveOmit<ReadSourceFilesDirOptions<O>, "versions" | "addVersion">
  & {
    versions?: Array<string> | boolean;
  };

export interface FileOptions {
  src: string;
  component?: unknown;
  file?: string;
  prefix?: string;
  repository?: string;
  rev?: string;
}

const local = (await env("LOCAL"))?.toLowerCase() === "true";

export async function readSourceFiles<O>(
  fileOptions: FileOptions,
  opts: ReadSourceFilesOptions<O>,
): Promise<Array<SourceFile<O>>> {
  const { src, readDirOpts } = await sanitizeFileOptions(fileOptions, opts);

  const files = await readSourceFilesDir(src, readDirOpts);

  if ("repository" in readDirOpts && readDirOpts.repository) {
    return files;
  }

  return files.sort(sortByKey("path"));
}

interface SanitizeFileOptionsResult<O> {
  src: string;
  readDirOpts: ReadSourceFilesDirOptions<O>;
}

async function sanitizeFileOptions<O>(
  fileOptions: FileOptions,
  opts: ReadSourceFilesOptions<O>,
): Promise<SanitizeFileOptionsResult<O>> {
  const path = parseRemotePath(fileOptions.src);
  const src = path.path;
  let repository = fileOptions.repository ??= path.repository;

  const versions = await sanitizeVersions(opts, repository);

  const { version: selectedVersion } = parseRoute(
    new URL(opts.req.url).pathname,
    versions?.all ?? [],
    opts.pages,
  );

  const rev = selectedVersion ?? versions?.latest ?? fileOptions.rev ??
    path.rev;

  // Fetch only from local (latest deployed version) if no version is selected
  // and local is not enforced.
  repository = !repository && !local && selectedVersion && "repository" in opts
    ? opts.repository
    : repository;

  return {
    src,
    readDirOpts: {
      ...opts,
      addVersion: !!selectedVersion,
      versions,
      repository,
      rev,
      prefix: fileOptions.prefix,
      component: fileOptions.component,
      file: fileOptions.file,
    },
  };
}

async function sanitizeVersions<O, U>(
  opts: ReadSourceFilesOptions<O>,
  repository?: string,
): Promise<GithubVersions | undefined> {
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
      const repo = repository || "repository" in opts && opts.repository;

      if (repo) {
        versions = await getVersions(repo);
      }
    }
  }

  return versions;
}

export type ReadSourceFilesDirOptions<O> =
  & DistributiveOmit<SourceFileOptions<O>, "isDirectory">
  & {
    recursive?: boolean;
    includeDirs?: boolean;
    includeFiles?: boolean;
    pattern?: RegExp;
    file?: string;
  };

async function readSourceFilesDir<O>(
  path: string,
  opts: ReadSourceFilesDirOptions<O>,
  basePath: string = path,
): Promise<Array<SourceFile<O>>> {
  if (opts.component || opts.file) {
    if (!opts.component || !opts.file) {
      throw new Error("Component or file option missing.");
    }
    const file = await readSourceFile(join(path, opts.file), {
      ...opts,
      basePath,
    });

    return [file];
  }

  const resultPromises: Array<Promise<SourceFile<O> | Array<SourceFile<O>>>> =
    [];

  for await (
    const dirEntry of readDir(path, "repository" in opts ? opts : undefined)
  ) {
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
      const filePromise = readSourceFile(fullPath, {
        ...opts,
        isDirectory: dirEntry.isDirectory,
        basePath,
      });

      if (dirEntry.isDirectory) {
        if (opts?.recursive) {
          resultPromises.push(
            readSourceFilesDir(
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
}

import { join, log } from "../../deps.ts";
import { SourceFile, SourceFileOptions } from "../resource/source_file.ts";
import { DistributiveOmit } from "../types.ts";
import { parseRemotePath, parseRoute, sortByKey } from "../utils.ts";
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

export async function readSourceFiles<O>(
  fileOptions: FileOptions,
  opts: ReadSourceFilesOptions<O>,
): Promise<Array<SourceFile<O>>> {
  log.debug("Read source files:", fileOptions.src);
  const path = parseRemotePath(fileOptions.src);
  fileOptions = {
    ...path,
    ...fileOptions,
    src: path.src,
  };

  const versions = await getSourceFileVersions(opts, fileOptions.repository);

  fileOptions.rev = versions?.selected ?? versions?.latest ?? fileOptions.rev;

  const files = await readSourceFilesDir(fileOptions.src, {
    ...opts,
    ...fileOptions,
    addVersion: !!versions?.selected,
    versions,
  });

  if ("repository" in fileOptions && fileOptions.repository) {
    return files;
  }

  return files.sort(sortByKey("path"));
}

export type SourceFileVersions = GithubVersions & {
  selected?: string;
};

async function getSourceFileVersions<O, U>(
  opts: ReadSourceFilesOptions<O>,
  repository?: string,
): Promise<SourceFileVersions | undefined> {
  let versions: SourceFileVersions | undefined;

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

    if (versions) {
      const { version: selectedVersion } = parseRoute(
        new URL(opts.req.url).pathname,
        versions.all ?? [],
        opts.pages,
      );

      versions = { ...versions, selected: selectedVersion };
    }
  }

  return versions;
}

export type ReadSourceFilesDirOptions<O> =
  & DistributiveOmit<SourceFileOptions<O>, "isDirectory" | "basePath">
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

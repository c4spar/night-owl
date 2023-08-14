import { getVersions, GithubVersions } from "./git/get_versions.ts";
import { readDir, ReadDirOptions } from "./read_dir.ts";
import { SourceFile } from "../source_file.ts";
import { env, parseRemotePath, parseRoute, sortByKey } from "../utils.ts";

export interface ReadSourceFilesOptions<O>
  extends Omit<ReadDirOptions<O>, "versions" | "addVersion"> {
  versions?: Array<string> | boolean;
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

export async function readSourceFiles<O>(
  fileOptions: FileOptions,
  opts: ReadSourceFilesOptions<O>,
): Promise<Array<SourceFile<O>>> {
  const { repository, rev, path: src } = parseRemotePath(fileOptions.src);
  fileOptions.src = src;
  fileOptions.repository ??= repository;
  fileOptions.rev ??= rev;

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
      const repo = fileOptions.repository ?? opts.repository;
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

  fileOptions.rev = selectedVersion ?? versions?.latest ?? fileOptions.rev;

  // Fetch only from local (latest deployed version) if no version is selected
  // and local is not enforced.
  if (!fileOptions.repository && !local && selectedVersion) {
    fileOptions.repository = opts.repository;
  }

  const files = await readDir(fileOptions.src, {
    ...opts,
    addVersion: !!selectedVersion,
    versions,
    repository: fileOptions.repository,
    rev: fileOptions.rev,
    prefix: fileOptions.prefix,
    component: fileOptions.component,
    file: fileOptions.file,
  });

  if (fileOptions.repository) {
    return files;
  }

  return files.sort(sortByKey("path"));
}

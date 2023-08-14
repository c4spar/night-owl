import { join } from "../../deps.ts";
import { ProviderOptions } from "../provider.ts";
import { SourceFile } from "../source_file.ts";
import { denoReadDir } from "./deno/read_dir.ts";
import { GithubVersions } from "./git/get_versions.ts";
import { GithubDirEntry, gitReadDir } from "./git/read_dir.ts";

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

export async function readDir<O>(
  path: string,
  opts: ReadDirOptions<O>,
  basePath: string = path,
): Promise<Array<SourceFile<O>>> {
  if (opts.component || opts.file) {
    if (!opts.component || !opts.file) {
      throw new Error("Component or file option missing.");
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
      : denoReadDir(path);
  }
}

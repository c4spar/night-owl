import { denoReadFile, DenoReadFileOptions } from "./deno/read_file.ts";

import { gitReadFile, GitReadFileOptions } from "./git/read_file.ts";

export type ReadFileOptions = GitReadFileOptions | DenoReadFileOptions;

export async function readFile(
  path: string,
  opts: ReadFileOptions,
): Promise<string> {
  try {
    return "repository" in opts && opts.repository
      ? await gitReadFile(path, opts)
      : await denoReadFile(path, opts);
  } catch (error: unknown) {
    throw new Error("Failed to read file: " + path, {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

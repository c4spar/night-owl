import { denoReadFile, DenoReadFileOptions } from "./deno/read_file.ts";

import { gitReadFile, GitReadFileOptions } from "./git/read_file.ts";

export type ReadTextFileOptions = GitReadFileOptions | DenoReadFileOptions;

export async function readTextFile(
  path: string,
  opts: ReadTextFileOptions,
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

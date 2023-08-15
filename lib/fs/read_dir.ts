import { denoReadDir } from "./deno/read_dir.ts";
import { GithubDirEntry, gitReadDir } from "./git/read_dir.ts";

export interface ReadDirOptions {
  repository: string;
  rev?: string;
}

export function readDir(
  path: string,
  opts?: ReadDirOptions,
): AsyncIterable<GithubDirEntry | Deno.DirEntry> {
  try {
    return opts && "repository" in opts && opts.repository
      ? gitReadDir(opts.repository, opts.rev, path)
      : denoReadDir(path);
  } catch (error: unknown) {
    throw new Error("Failed to read dir: " + path, {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

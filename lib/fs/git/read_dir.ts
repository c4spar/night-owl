import { basename, blue, red } from "../../../deps.ts";
import { gitFetch } from "./git_fetch.ts";

export interface GithubDirResult {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: number;
  url: string;
}

export type GithubDirEntry = GithubDirResult & Deno.DirEntry;

export async function* gitReadDir(
  repository: string,
  rev?: string,
  path?: string,
): AsyncGenerator<GithubDirEntry> {
  const files = await gitGetDir(repository, rev, path);

  for (const file of files) {
    // ignore hidden files
    if (file.name[0] !== ".") {
      yield file;
    }
  }
}

async function gitGetDir(
  repository: string,
  rev?: string,
  path?: string,
  baseRev: string | undefined = rev,
  basePath: string | undefined = path,
): Promise<Array<GithubDirEntry>> {
  path = path?.replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const { tree } = await gitFetch<{ tree: Array<GithubDirResult> }>(
    repository,
    `git/trees/${rev || "main"}`,
  );

  if (path) {
    const [name, ...parts] = path.split("/");
    for (const file of tree) {
      if (file.path === name) {
        return gitGetDir(
          repository,
          file.sha,
          parts.join("/"),
          baseRev,
          basePath,
        );
      }
    }
    throw new Error(
      `File not found: ${red(`${repository}@${rev}:${path}`)}, original rev: ${
        blue(`${repository}@${baseRev}:${basePath}`)
      }`,
    );
  }

  return tree.map((file) => ({
    name: basename(file.path),
    isDirectory: file.type === "tree",
    isFile: file.type === "blob",
    isSymlink: false,
    ...file,
  }));
}

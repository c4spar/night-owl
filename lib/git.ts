import { basename, blue, decodeBase64, green, log, lookup } from "../deps.ts";
import { Cache } from "./cache.ts";
import { joinUrl } from "./utils.ts";

const apiUrl = "https://api.github.com";

const gitCache = new Cache<GithubResponse>();

interface GithubResponse {
  message: string;
  // deno-lint-ignore camelcase
  documentation_url: string;
}

export interface GithubVersions {
  latest: string;
  all: Array<string>;
  tags: Array<string>;
  branches: Array<string>;
}

const versions: Record<string, Promise<GithubVersions>> = {};

export function getVersions(repository: string): Promise<GithubVersions> {
  if (!versions[repository]) {
    versions[repository] = get();
  }

  return versions[repository];

  async function get() {
    const [tags, branches] = await Promise.all([
      gitFetch<Array<{ ref: string }>>(repository, "git/refs/tags"),
      gitFetch<Array<{ name: string; protected: boolean }>>(
        repository,
        "branches",
      ),
    ]);

    const tagNames = tags
      .map((tag) => tag.ref.replace(/^refs\/tags\//, ""))
      .reverse();

    const branchNames = branches
      .sort((a, b) =>
        (a.protected === b.protected) ? 0 : (a.protected ? 1 : -1)
      )
      .filter((tag) => tag.protected)
      .map((tag) => tag.name)
      .reverse();

    return {
      all: [
        ...tagNames,
        ...branchNames,
      ],
      latest: tagNames[0],
      tags: tagNames,
      branches: branchNames,
    };
  }
}

interface GithubDirEntry {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: number;
  url: string;
}

export async function gitGetDir(
  repository: string,
  rev: string,
  path?: string,
): Promise<Array<GithubDirEntry & Deno.DirEntry>> {
  path = path?.replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const { tree } = await gitFetch<{ tree: Array<GithubDirEntry> }>(
    repository,
    `git/trees/${rev}`,
  );

  if (path) {
    const [name, ...parts] = path.split("/");
    for (const file of tree) {
      if (file.path === name) {
        return gitGetDir(repository, file.sha, parts.join("/"));
      }
    }
  }

  return tree.map((file) => ({
    name: basename(file.path),
    isDirectory: file.type === "tree",
    isFile: file.type === "blob",
    isSymlink: false,
    ...file,
  }));
}

export async function* gitReadDir(
  repository: string,
  rev: string,
  path?: string,
): AsyncGenerator<GithubDirEntry & Deno.DirEntry> {
  const files = await gitGetDir(repository, rev, path);

  for (const file of files) {
    // ignore hidden files
    if (file.name[0] !== ".") {
      yield file;
    }
  }
}

const decoder = new TextDecoder("utf8");

export async function gitReadFile(
  repository: string,
  rev: string,
  path: string,
  base64?: boolean,
): Promise<string> {
  path = path.replace(/^\//, "")
    .replace(/\/$/, "");

  const file = await gitFetch<{ content: string }>(
    repository,
    `contents/${path}?rev=${rev}`,
  );

  try {
    return base64
      ? `data:${lookup(path)};charset=utf-8;base64,${file.content}`
      : decoder.decode(decodeBase64(file.content));
  } catch (error: unknown) {
    throw new Error("Failed to decode base64 string: " + file.content, {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

async function gitFetch<T>(repository: string, endpoint: string): Promise<T> {
  const cacheKey = joinUrl(repository, endpoint);

  let data = gitCache.get<GithubResponse & T>(cacheKey);

  if (data) {
    return data;
  }

  const url = new URL(joinUrl("repos", repository, endpoint), apiUrl).href;

  const headers = new Headers({ "Content-Type": "application/json" });

  const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

  if (GITHUB_TOKEN) {
    headers.set("Authorization", `token ${GITHUB_TOKEN}`);
  }

  log.debug("Git fetch:", blue(url));

  const response = await fetch(url, {
    method: "GET",
    cache: "default",
    headers,
  });

  if (!response.status) {
    throw new Error("Failed to fetch versions.");
  }

  data = await response.json();

  log.debug("Git fetch done:", green(url));

  if (!data) {
    throw new Error("Github request failed: " + url.toString());
  } else if ("message" in data && "documentation_url" in data) {
    throw new Error(
      data.message + " " + url.toString() + " --> " + data.documentation_url,
    );
  }

  gitCache.set(cacheKey, data);

  return data;
}

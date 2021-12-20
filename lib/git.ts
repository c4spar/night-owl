import { Cache } from "./cache.ts";

const apiUrl = "https://api.github.com";

const gitCache = new Cache<GithubResponse>();

interface GithubResponse {
  message: string;
  // deno-lint-ignore camelcase
  documentation_url: string;
}

export async function getVersions(repository: string): Promise<Array<string>> {
  const tags = await gitFetch<Array<{ ref: string }>>(
    repository,
    "git/refs/tags",
  );

  return tags
    .map((tag) => tag.ref.replace(/^refs\/tags\//, ""))
    .reverse();
}

async function gitFetch<T>(repository: string, endpoint: string): Promise<T> {
  const cacheKey = `${repository}/${endpoint}`;

  let data = gitCache.get<GithubResponse & T>(cacheKey);

  if (data) {
    return data;
  }

  const url = new URL(`repos/${repository}/${endpoint}`, apiUrl).href;

  const headers = new Headers({ "Content-Type": "application/json" });

  const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

  if (GITHUB_TOKEN) {
    headers.set("Authorization", `token ${GITHUB_TOKEN}`);
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "default",
    headers,
  });

  if (!response.status) {
    throw new Error("Failed to fetch versions.");
  }

  data = await response.json();

  if (!data) {
    throw new Error("Github request failed: " + url.toString());
  } else if ("message" in data && "documentation_url" in data) {
    throw new Error(data.message + " " + data.documentation_url);
  }

  gitCache.set(cacheKey, data);

  return data;
}

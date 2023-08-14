import { blue, green, log } from "../../../deps.ts";
import { Cache } from "../../cache.ts";
import { env, joinUrl } from "../../utils.ts";

export const apiUrl = "https://api.github.com";

export const gitCache = new Cache<string>();

export interface GithubResponse {
  message: string;
  // deno-lint-ignore camelcase
  documentation_url: string;
}

export async function gitFetch<T>(
  repository: string,
  endpoint: string,
): Promise<T> {
  const cacheKey = joinUrl(repository, endpoint);
  const cachedData = gitCache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const url = new URL(joinUrl("repos", repository, endpoint), apiUrl).href;

  const headers = new Headers({ "Content-Type": "application/json" });

  const GITHUB_TOKEN = await env("GITHUB_TOKEN");

  if (GITHUB_TOKEN) {
    headers.set("Authorization", `token ${GITHUB_TOKEN}`);
  }

  log.debug("Fetch %s", blue(url));

  const response = await fetch(url, {
    method: "GET",
    cache: "default",
    headers,
  });

  if (!response.status) {
    throw new Error("Failed to fetch versions from github.");
  }

  const text = await response.text();

  gitCache.set(cacheKey, text);

  const data: GithubResponse | T = JSON.parse(text);

  log.debug("Done %s", green(url));

  if (!data) {
    throw new Error("Github request failed: " + url.toString());
  } else if (isGithubErrorResponse(data)) {
    throw new Error(
      data.message + " " + url.toString() + " --> " + data.documentation_url,
    );
  }

  return data;
}

function isGithubErrorResponse<T>(data: unknown): data is GithubResponse {
  return data !== null && typeof data === "object" && "message" in data &&
    "documentation_url" in data;
}

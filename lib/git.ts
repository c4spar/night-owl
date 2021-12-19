import { config } from "./config.ts";

const apiUrl = "https://api.github.com";

interface GithubResponse {
  message: string;
  // deno-lint-ignore camelcase
  documentation_url: string;
}

export async function getVersions(): Promise<Array<string>> {
  const tags = await gitFetch<Array<{ ref: string }>>("git/refs/tags");

  return tags
    .map((tag) => tag.ref.replace(/^refs\/tags\//, ""))
    .reverse();
}

async function gitFetch<T>(endpoint: string): Promise<T> {
  const url = new URL(`repos/${config.repository}/${endpoint}`, apiUrl).href;

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

  const data: GithubResponse & T = await response.json();

  if ("message" in data && "documentation_url" in data) {
    throw new Error(data.message + " " + data.documentation_url);
  }

  return data;
}

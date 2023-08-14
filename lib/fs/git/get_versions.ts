import { rcompare } from "../../../deps.ts";
import { gitFetch } from "./git_fetch.ts";

export interface GithubVersions {
  latest?: string;
  all: Array<string>;
  tags: Array<string>;
  branches: Array<string>;
}

const versions: Record<string, Promise<GithubVersions>> = {};

export function getVersions(repository: string): Promise<GithubVersions> {
  if (!versions[repository]) {
    versions[repository] = fetchVersions(repository);
  }

  return versions[repository];
}

async function fetchVersions(repository: string) {
  const [tags, branches] = await Promise.all([
    fetchTags(repository),
    // catch not found error if no branches are available.
    fetchBranches(repository).catch(() => []),
  ]);

  const tagNames = tags
    .map((tag) => tag.ref.replace(/^refs\/tags\//, ""))
    .sort((a, b) => rcompare(a, b));

  const branchNames = branches
    .sort((a, b) => (a.protected === b.protected) ? 0 : (a.protected ? 1 : -1))
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

interface GitTag {
  ref: string;
}

async function fetchTags(repository: string): Promise<Array<GitTag>> {
  try {
    return await gitFetch<Array<{ ref: string }>>(repository, "git/refs/tags");
  } catch {
    return [];
  }
}

interface GitBranch {
  name: string;
  protected: boolean;
}

function fetchBranches(repository: string): Promise<Array<GitBranch>> {
  return gitFetch<Array<{ name: string; protected: boolean }>>(
    repository,
    "branches",
  );
}

import { fromFileUrl } from "../deps.ts";
import { GithubVersions } from "./fs/git/get_versions.ts";
import { SourceFile } from "./source_file.ts";

export async function env(
  name: string,
  required: true,
): Promise<string>;
export async function env(
  name: string,
  required?: boolean,
): Promise<string | undefined>;
export async function env(
  name: string,
  required?: boolean,
): Promise<string | undefined> {
  const desc: Deno.PermissionDescriptor = { name: "env", variable: name };

  const { state } = "permissions" in Deno
    ? (required
      ? await Deno.permissions.request(desc)
      : await Deno.permissions.query(desc))
    : { state: "granted" };

  if (state === "granted") {
    const value = Deno.env.get(name);
    if (required && !value) {
      throw new Error(`missing env var: ${name}`);
    }
    return value;
  }

  if (required) {
    throw new Error("Permission denied to env var: " + name);
  }

  return undefined;
}

export function capitalize(str: string): string {
  return str.length > 0
    ? str[0].toUpperCase() + (str.length > 1 ? str.slice(1) : "")
    : str;
}

export function sortByKey<K extends string>(name: K) {
  return (a: Record<K, string>, b: Record<K, string>) => {
    if (a[name] < b[name]) {
      return -1;
    }
    if (a[name] > b[name]) {
      return 1;
    }
    return 0;
  };
}

export function joinUrl(...paths: Array<string | undefined>) {
  const hash = paths.at(-1)?.[0] === "#" ? paths.pop() : "";
  let url = "";

  for (const path of paths) {
    if (path && path !== "." && path !== "./") {
      url += path + "/";
    }
  }

  url = url
    // replace double slash's with single slash
    .replace(/\/+/g, "/")
    // replace trailing slash
    .replace(/\/$/, "") || "/";

  return url + hash;
}

export function pathToUrl(...paths: Array<string>): string {
  return joinUrl(...paths.map((path) => {
    if (path === "/" || path[0] === "#") {
      return path;
    }
    return path
      // remove dot
      .replace(/^\.$/, "")
      // remove leading slash
      .replace(/^(\/|\.\/)+/, "")
      // remove trailing slash
      .replace(/[\/+.?]+$/, "")
      // remove ordering prefix
      .replace(/^[0-9]+_/, "")
      .replace(/\/[0-9]+_/g, "/")
      // replace special chars with hyphens
      .replace(/'/g, "")
      .replace(/[_\s,?']+/g, "-")
      // remove file extension
      .replace(/\.[a-zA-Z0-9]+$/, "");
  })).toLowerCase();
}

export function getLabel(routeName: string): string {
  const label = routeName
    .split("/")
    .at(-1)!
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/[_-]/g, " ");

  return label.length > 0 ? capitalize(label) : label;
}

interface ParseRemotePathResult {
  repository?: string;
  rev?: string;
  path: string;
}

export function parseRemotePath(path: string): ParseRemotePathResult {
  let [_, repository, rev, filePath]: Array<string | undefined> = [];
  if (path.startsWith("file:")) {
    filePath = fromFileUrl(path);
  } else if (path.startsWith("http:") || path.startsWith("https:")) {
    const url = new URL(path);
    // https://raw.githubusercontent.com/c4spar/cliffy.io/main/pages
    // https://github.com/c4spar/cliffy.io/tree/main/pages
    if (
      url.hostname === "raw.githubusercontent.com" ||
      url.hostname === "github.com"
    ) {
      [_, repository, _, rev, filePath] = url.pathname.match(
        /^\/([^\/]+\/[^\/]+)(\/tree)?\/([^\/]+)(.*)/,
      ) ?? [];
    } else {
      throw new Error("Unsupported src url: " + path);
    }
  } else {
    [_, _, repository, rev, filePath] = path.match(
      /^((.*)@(.+):)?(.*)/,
    ) ?? [];
  }

  return {
    repository: repository || undefined,
    rev: rev || undefined,
    path: filePath || "/",
  };
}

function getVersionsPattern(versions: Array<string> = []): string {
  return "(" +
    versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|") +
    ")";
}

export function getRouteRegex(
  versions?: Array<string>,
  pages?: boolean,
): RegExp {
  return new RegExp(
    pages
      ? `^(((/[^/@]+)(@${getVersionsPattern(versions)})?)(/([^/]+)?)?)(.+)?`
      : `^(((/${getVersionsPattern(versions)})?)(/([^/]+)?)?)(.+)?`,
  );
}

export function removeVersion(
  route: string,
  versions?: Array<string>,
  pages?: boolean,
): string {
  return versions?.length
    ? route.replace(
      new RegExp(
        pages
          ? `@${getVersionsPattern(versions)}`
          : `/${getVersionsPattern(versions)}`,
      ),
      "",
    ) || "/"
    : route;
}

export function parseRoute(
  route: string,
  versions?: Array<string>,
  pages?: boolean,
) {
  const match = route.match(getRouteRegex(versions, pages)) ?? [];
  let [_, path, pagePrefix, version, selectedPage]: Array<string | undefined> =
    [];

  if (pages) {
    [_, path, pagePrefix, _, _, version, selectedPage] = match;
  } else {
    [_, path, pagePrefix, _, version, _, selectedPage] = match;
  }

  return {
    path: path || "/",
    pagePrefix: pagePrefix || "/",
    version: version || undefined,
    selectedPage: selectedPage || "/",
  };
}

export type Flat<T> = T extends Array<infer V> ? Flat<V> : T;

export function flat<T>(arr: Array<T>): Array<Flat<T>> {
  return arr.map((item) => Array.isArray(item) ? flat(item) : item).flat();
}

export function matchFile(
  sourceFiles: Array<SourceFile>,
  url: string,
): SourceFile | undefined {
  const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";

  const files = sourceFiles.filter((file) => file.route === pathname);

  const file = files.find((file) => !file.isDirectory) ?? files[0];

  if (!file && pathname === "/") {
    return sourceFiles.find((file) => !file.isDirectory);
  }

  return file;
}

export function addLatestVersion(
  route: string,
  versions: GithubVersions,
  pages?: boolean,
) {
  const regex = getRouteRegex(
    versions.all,
    pages,
  );
  const replace = pages
    ? "$3@" + versions.latest + "$6$8"
    : "/" + versions.latest + "$5$7";

  return route.replace(
    regex,
    replace,
  ).replace(/\/+$/, "") || "/";
}

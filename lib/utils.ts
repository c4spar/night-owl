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

export function joinUrl(...path: Array<string | undefined>) {
  let url = "";

  for (const part of path) {
    if (part && part !== "." && part !== "./") {
      url += part + "/";
    }
  }

  return url
    // replace double slash's with single slash
    .replace(/\/+/g, "/")
    // replace trailing slash
    .replace(/\/$/, "") || "/";
}

export function pathToUrl(...paths: Array<string>): string {
  return joinUrl(...paths.map((path) => {
    if (path === "/") {
      return path;
    }
    return path
      // remove dot
      .replace(/^\.$/, "")
      // remove leading slash
      .replace(/^(\/|\.\/)+/, "")
      // remove trailing slash
      .replace(/\/+$/, "")
      // remove ordering prefix
      .replace(/^[0-9]+_/, "")
      .replace(/\/[0-9]+_/g, "/")
      // replace special chars with hyphens
      .replace(/[_\s]/g, "-")
      // remove file extension
      .replace(/\.[a-zA-Z0-9]+/, "");
  }));
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

export function parseRemotePath(path: string) {
  const [_, __, repository, rev, filePath] = path.match(
    /^((.*)@(.+):)?(.*)/,
  ) ?? [];

  return { repository, rev, path: filePath || "/" };
}

function getVersionsPattern(versions: Array<string>): string {
  return "(" +
    versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|") +
    ")";
}

export function getRouteRegex(
  versions: Array<string>,
  pages?: boolean,
): RegExp {
  return new RegExp(
    pages
      ? `^(((/[^/@]+)(@${getVersionsPattern(versions)})?)(/([^/]+)?)?)(.+)?`
      : `^(((/${getVersionsPattern(versions)})?)(/([^/]+)?)?)(.+)?`,
  );
}

export function parseRoute(
  route: string,
  versions: Array<string>,
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

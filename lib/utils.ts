export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
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

export function joinUrl(...path: Array<string | undefined>) {
  let url = "";

  for (const part of path) {
    if (part && part !== "/" && part !== "." && part !== "./") {
      url += part + "/";
    }
  }

  return url
    // replace double slash's with single slash
    .replace(/\/+/g, "/")
    // replace trailing slash
    .replace(/\/$/, "") || "/";
}

export function pathToUrl(path: string): string {
  return "/" + path
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
}

export function getLabel(routeName: string): string {
  const label = routeName
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

export function getVersionsPattern(versions: Array<string>): string {
  return "(" +
    versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|") +
    ")";
}

export function getVersionsRegex(versions: Array<string>): RegExp {
  return new RegExp(`^/docs(@${getVersionsPattern(versions)})`);
}

export function matchVersion(
  url: string,
  versions: Array<string>,
): string | undefined {
  return url.match(getVersionsRegex(versions))?.[2];
}

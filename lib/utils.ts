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
  return str[0].toUpperCase() + str.slice(1);
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
    if (part) {
      url += "/" + part;
    }
  }
  return url
    // replace double slash's with single slash
    .replace(/(\.?\/)+/g, "/")
    // replace trailing slash
    .replace(/\/$/, "") || "/";
}

export function pathToUrl(path: string): string {
  return "/" + path
    // remove trailing slash
    .replace(/^\.?\//, "")
    // remove ordering prefix
    .replace(/^[0-9]+_/, "")
    .replace(/\/[0-9]+_/g, "/")
    // replace special chars with hyphens
    .replace(/_/g, "-")
    // remove file extension
    .replace(/\.[a-zA-Z0-9]+/, "");
}

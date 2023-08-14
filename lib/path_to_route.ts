import { basename, dirname } from "../deps.ts";
import { GithubVersions } from "./fs/git/get_versions.ts";
import { getRouteRegex, joinUrl, parseRemotePath, pathToUrl } from "./utils.ts";

export interface PathToRouteOptions {
  basePath?: string;
  prefix?: string;
  addVersion?: boolean;
  versions?: GithubVersions;
  pages?: boolean;
  rev?: string;
}

export interface PathToRouteResult {
  routePrefix: string;
  routeName: string;
  route: string;
}

export function pathToRoute<O>(
  path: string,
  opts?: PathToRouteOptions,
): PathToRouteResult {
  const fileName = basename(path);
  const dirName = dirname(path);
  let routeName = pathToUrl("/", fileName);
  let routePrefix = pathToUrl("/", dirName);

  // Trim base path.
  if (opts?.basePath) {
    const { path: basePath } = parseRemotePath(opts.basePath);
    const basePathRegex = new RegExp(`^${pathToUrl("/", basePath)}`);
    routePrefix = joinUrl(
      "/",
      routePrefix.replace(basePathRegex, "/"),
    );
  }

  if (opts?.prefix) {
    routePrefix = joinUrl(opts.prefix, routePrefix);
  }

  // Add selected version to url.
  if (
    opts?.addVersion &&
    opts?.versions
  ) {
    routePrefix = routePrefix.replace(
      getRouteRegex(opts.versions.all, opts.pages),
      opts.pages ? "$3@" + opts.rev + "$6$8" : "/" + opts.rev + "$5$7",
    ).replace(/\/+$/, "") || "/";
  }

  let route: string;
  if (["/index", "/README"].includes(routeName)) {
    routeName = "/";
    route = joinUrl(routePrefix, routeName);
    routePrefix = routePrefix.split("/").slice(0, -1).join("/") || "/";
  } else {
    route = joinUrl(routePrefix, routeName);
  }

  return {
    routePrefix,
    routeName,
    route,
  };
}

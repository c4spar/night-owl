/** @jsx h */

import { Component, Fragment, h, log, red, render, tw } from "../deps.ts";
import { joinUrl } from "../lib/utils.ts";
import { NotFound } from "./not_found.tsx";
import { Route, RouteOptions } from "./route.tsx";

type RouterChild = { component: typeof Route; props: RouteOptions };

interface RouterOptions {
  url: string;
  prefix?: string;
  children: Array<RouterChild>;
}

export class RouteNotFoundError extends Error {
  constructor(url: string) {
    super("Route not found: " + url);
  }
}

export class Router extends Component<RouterOptions> {
  #url: URL;
  #path: string;

  constructor(props: RouterOptions) {
    super(props);
    // @TODO: create normalizeUrl method
    this.#url = new URL(
      this.props.url
        .replace(/\/+/, "/")
        .replace(/\/$/, ""),
    );
    this.#path = (
      this.props.prefix && this.props.prefix !== "/"
        ? this.#url.pathname.replace(new RegExp(`^${this.props.prefix}`), "")
        : this.#url.pathname
    ).replace(/\/+/, "/")
      .replace(/\/$/, "") || "/";
  }

  render() {
    const route = this.#match();

    if (route) {
      try {
        return render(route);
      } catch (error: unknown) {
        if (!isRouteNotFoundError(error)) {
          throw error;
        }
      }
    }

    return this.#notFound();
  }

  #match(): RouterChild | undefined {
    for (const route of this.props.children.flat()) {
      if (!route) {
        continue;
      }

      const paths = Array.isArray(route.props.path)
        ? route.props.path
        : [route.props.path];

      const matched = paths.find((path) => this.#matchRoute(route, path));
      if (matched) {
        return route;
      }
    }

    log.error(red(`[GET]`), "Route not found:", this.#path);
  }

  #matchRoute(
    route: RouterChild,
    routePath: string | RegExp,
  ): RouterChild | undefined {
    let matchedRoute: RouterChild | undefined = undefined;
    let path: string | undefined;

    if (routePath instanceof RegExp) {
      const matched = this.#path.match(routePath);

      if (matched) {
        path = matched[0];
      }
    } else {
      const matched = route.props.partialMatch
        ? this.#path.startsWith(routePath)
        : this.#path === routePath;

      if (matched) {
        path = routePath;
      }
    }

    if (path) {
      path = path.replace(/\/$/, "") || "/";
      route.props._path = this.#path.substr(path.length) || "/";
      route.props._prefix = joinUrl("/", this.props.prefix, path);
      route.props._url = this.props.url;
      matchedRoute = route;
    }

    return matchedRoute;
  }

  #notFound() {
    if (this.props.prefix) {
      throw new RouteNotFoundError(this.props.url);
    }

    return <NotFound url={this.props.url} />;
  }
}

function isRouteNotFoundError(error: unknown): error is RouteNotFoundError {
  return error instanceof RouteNotFoundError;
}

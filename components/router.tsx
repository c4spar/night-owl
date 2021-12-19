/** @jsx h */

import { Component, Fragment, h, red, render, tw } from "../deps.ts";
import { joinUrl } from "../lib/utils.ts";
import { AnimatedText } from "./animated_text.tsx";
import { Route, RouteOptions } from "./route.tsx";

type RouterChild = { component: typeof Route; props: RouteOptions };

interface RouterOptions {
  url: string;
  prefix?: string;
  children: Array<RouterChild>;
}

export class RouteNotFoundError extends Error {
  constructor() {
    super("Route not found.");
  }
}

export class Router extends Component<RouterOptions> {
  #url: URL;
  #path: string;

  constructor(props: RouterOptions) {
    super(props);
    this.#url = new URL(this.props.url.replace(/\/+$/, ""));
    this.#path = (
      this.props.prefix && this.props.prefix !== "/"
        ? this.#url.pathname.replace(new RegExp(`^${this.props.prefix}`), "")
        : this.#url.pathname
    ) || "/";
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
    const matched: RouterChild | undefined = this.props.children.find(
      (route) => {
        const routes = Array.isArray(route.props.path)
          ? route.props.path
          : [route.props.path];

        return routes.find((path) => this.#matchRoute(route, path));
      },
    );

    if (!matched) {
      console.error(red(`[GET]`), "Route not found:", this.#path);
    }

    return matched;
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
      route.props._prefix = joinUrl(this.props.prefix ?? "/", path);
      route.props._url = this.props.url;
      matchedRoute = route;
    }

    return matchedRoute;
  }

  #notFound() {
    if (this.props.prefix) {
      throw new RouteNotFoundError();
    }

    return (
      <Fragment>
        <AnimatedText
          speed={6}
          class={tw
            `container mx-auto p-5 mt-[10%] font-nerd text-xl text-center`}
        >
          Oops, you have requested a site that does not exist!
        </AnimatedText>
      </Fragment>
    );
  }
}

function isRouteNotFoundError(error: unknown): error is RouteNotFoundError {
  return error instanceof RouteNotFoundError;
}

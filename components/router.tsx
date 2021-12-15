/** @jsx h */

import { Component, h, red, render, tw } from "../deps.ts";
import { joinUrl } from "../lib/utils.ts";
import { AnimatedText } from "./animated_text.tsx";
import { Route, RouteOptions } from "./route.tsx";

type RouterChild = { component: typeof Route; props: RouteOptions };

interface RouterOptions {
  url: string;
  prefix?: string;
  children: Array<RouterChild>;
}

class RouteNotFoundError extends Error {
  constructor() {
    super("Route not found.");
  }
}

export class Router extends Component<RouterOptions> {
  #url: URL;
  #path: string;

  constructor(props: RouterOptions) {
    super(props);

    this.#url = new URL(this.props.url);
    this.#path = (
      this.props.prefix && this.props.prefix !== "/"
        ? this.#url.pathname.replace(new RegExp(`^${this.props.prefix}`), "")
        : this.#url.pathname
    ) || "/";
  }

  render() {
    this.props.url = this.props.url.replace(/\/+$/, "") || "/";

    const route = this.#matchRoute();

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

  #matchRoute(): RouterChild | undefined {
    let matchedRoute: RouterChild | undefined;

    for (const route of this.props.children) {
      let path: string | undefined;

      if (route.props.path instanceof RegExp) {
        const matched = this.#path.match(route.props.path);

        if (matched) {
          path = matched[0];
        }
      } else {
        const matched = route.props.partialMatch
          ? this.#path.startsWith(route.props.path)
          : this.#path === route.props.path;

        if (matched) {
          path = route.props.path;
        }
      }

      if (path) {
        route.props._path = this.#path.substr(path.length) || "/";
        route.props._prefix = joinUrl(this.props.prefix ?? "/", path);
        route.props._url = this.props.url;
        matchedRoute = route;

        break;
      }
    }

    if (!matchedRoute) {
      console.error(red(`[GET]`), "Route not found:", this.#path);
    }

    return matchedRoute;
  }

  #notFound() {
    if (this.props.prefix) {
      throw new RouteNotFoundError();
    }

    return (
      <AnimatedText
        speed={6}
        class={tw`container mx-auto font-nerd text-xl text-center`}
      >
        Oops, you have requested a site that does not exist!
      </AnimatedText>
    );
  }
}

function isRouteNotFoundError(error: unknown): error is RouteNotFoundError {
  return error instanceof RouteNotFoundError;
}

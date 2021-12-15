/** @jsx h */

import { Component, h, red, render, tw } from "../deps.ts";
import { AnimatedText } from "./animated_text.tsx";
import { Route, RouteOptions } from "./route.tsx";

type RouterChild = { component: typeof Route; props: RouteOptions };

interface RouterOptions {
  throw?: boolean;
  route: string;
  children: Array<RouterChild>;
}

class RouteNotFoundError extends Error {
  constructor() {
    super("Route not found.");
  }
}

export class Router extends Component<RouterOptions> {
  render() {
    this.props.route = this.props.route.replace(/\/+$/, "") || "/";

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
        const matched = this.props.route.match(route.props.path);

        if (matched) {
          path = matched[0];
        }
      } else {
        const matched = route.props.partialMatch
          ? this.props.route.startsWith(route.props.path)
          : this.props.route === route.props.path;

        if (matched) {
          path = route.props.path;
        }
      }

      if (path) {
        route.props._route = this.props.route.substr(path.length);
        route.props._path = path;
        matchedRoute = route;

        break;
      }
    }

    if (!matchedRoute) {
      console.error(red(`[GET]`), "Route not found:", this.props.route);
    }

    return matchedRoute;
  }

  #notFound() {
    if (this.props.throw) {
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

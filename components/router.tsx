/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { AnimatedText } from "./animated_text.tsx";
import { Route, RouteOptions } from "./route.tsx";

interface RouterOptions {
  route: string;
  children: Array<{ component: typeof Route; props: RouteOptions }>;
}

export class Router extends Component<RouterOptions> {
  render() {
    this.props.route = this.props.route.replace(/\/+$/, "") || "/";
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

        return render(route);
      }
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

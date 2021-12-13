/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { AnimatedText } from "./animated_text.tsx";

interface RouterOptions {
  route: string;
  children: Array<{
    component: unknown;
    props: {
      path: string;
      route: string;
    };
  }>;
}

export class Router extends Component<RouterOptions> {
  render() {
    for (const child of this.props.children) {
      if (child.props.path === this.props.route) {
        return render(child);
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

/** @jsx h */

import { Component, Fragment, h, render } from "../deps.ts";

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
    return <div>404 Not Found!</div>;
  }
}

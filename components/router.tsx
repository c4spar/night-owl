/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, Fragment, h, render } from "../deps.ts";

interface RouterOptions {
  route: string;
  children: Array<{ component: any; props: any }>;
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

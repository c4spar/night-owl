/** @jsx h */

import { Component, Fragment, h, render } from "../deps.ts";

interface RouteOptions {
  path: string;
  children: Array<{ component: unknown; props: unknown }>;
}

export class Route extends Component<RouteOptions> {
  render() {
    return <Fragment>{render(this.props.children)}</Fragment>;
  }
}

/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, Fragment, h, render } from "../deps.ts";

interface RouteOptions {
  path: string;
  children: Array<{ component: any; props: any }>;
}

export class Route extends Component<RouteOptions> {
  render() {
    return <Fragment>{render(this.props.children)}</Fragment>;
  }
}

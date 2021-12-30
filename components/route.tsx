/** @jsx h */

import { assert, Component, Fragment, h, render } from "../deps.ts";
import { ChildComponent } from "../lib/types.ts";
import { Routable, RoutableOptions, RoutableType } from "../lib/routable.ts";

export type RoutableComponent = {
  component: RoutableType<unknown, unknown>;
  props: RoutableOptions;
};

export interface RouteOptions {
  path: string | RegExp | Array<string | RegExp>;
  _prefix?: string;
  _path?: string;
  _url?: string;
  partialMatch?: boolean;
  children:
    | ChildComponent & RoutableComponent
    | Array<ChildComponent & RoutableComponent>;
}

export class Route extends Component<RouteOptions> {
  constructor(props: RouteOptions) {
    super(props);

    assert(this.props.path, "route.path is not defined.");
  }
  render() {
    const children = Array.isArray(this.props.children)
      ? this.props.children
      : [this.props.children];
    for (const page of children) {
      if (isPageChild(page)) {
        page.props._prefix = this.props._prefix || "/";
        page.props._path = this.props._path || "/";
        page.props._url = this.props._url || "/";
      }
    }

    return <Fragment>{render(children)}</Fragment>;
  }
}

function isPageChild(child: unknown): child is RoutableComponent {
  // deno-lint-ignore no-explicit-any
  return (child as any)?.component?.constructor === Routable.constructor;
}

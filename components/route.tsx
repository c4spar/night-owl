/** @jsx h */

import { Component, Fragment, h, render } from "../deps.ts";
import { ChildComponent } from "../lib/types.ts";
import { Page, PageOptions } from "./page.tsx";

type PageComponent = { component: typeof Page; props: PageOptions };

export interface RouteOptions {
  path: string | RegExp;
  _prefix?: string;
  _path?: string;
  _url?: string;
  partialMatch?: boolean;
  children: Array<ChildComponent & PageComponent>;
}

export class Route extends Component<RouteOptions> {
  render() {
    for (const page of this.props.children) {
      if (isPageChild(page)) {
        page.props._prefix = this.props._prefix || "/";
        page.props._path = this.props._path || "/";
        page.props._url = this.props._url || "/";
      }
    }

    return <Fragment>{render(this.props.children)}</Fragment>;
  }
}

function isPageChild(child: unknown): child is PageComponent {
  // deno-lint-ignore no-explicit-any
  return (child as any)?.component?.constructor === Page.constructor;
}

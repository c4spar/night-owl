/** @jsx h */

import { Component, Fragment, h, render } from "../deps.ts";
import { ChildComponent } from "../lib/types.ts";
import { Page, PageOptions } from "./page.tsx";

type PageComponent = { component: typeof Page; props: PageOptions };

export interface RouteOptions {
  path: string | RegExp;
  _route?: string;
  _path?: string;
  partialMatch?: boolean;
  children: Array<ChildComponent & PageComponent>;
}

export class Route extends Component<RouteOptions> {
  render() {
    for (const page of this.props.children) {
      if (isPageChild(page)) {
        page.props._prefix = this.props._path;
        page.props._route = this.props._route;
      }
    }

    return <Fragment>{render(this.props.children)}</Fragment>;
  }
}

function isPageChild(
  child: ChildComponent & PageComponent,
): child is PageComponent {
  return child.component.constructor === Page.constructor;
}

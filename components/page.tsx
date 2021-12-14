/** @jsx h */

import { Component, h } from "../deps.ts";

export interface PageOptions {
  _prefix?: string;
  _route?: string;
}

export class Page<T = unknown, S = unknown>
  extends Component<T & PageOptions, S> {
  public prefix;
  public route;
  constructor(props: T & PageOptions) {
    super(props);
    this.prefix = props._prefix ?? "/";
    this.route = props._route ?? "/";
  }
}

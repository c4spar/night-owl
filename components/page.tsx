/** @jsx h */

import { Component, h } from "../deps.ts";
import { joinUrl } from "../lib/utils.ts";

export interface PageOptions {
  _prefix?: string;
  _path?: string;
  _url?: string;
}

export class Page<T = unknown, S = unknown>
  extends Component<T & PageOptions, S> {
  readonly #prefix: string;
  readonly #path: string;
  readonly #url: string;

  constructor(props: T & PageOptions) {
    super(props);
    this.#prefix = props._prefix || "/";
    this.#path = props._path || "/";
    this.#url = props._url || "/";
  }

  get prefix(): string {
    return this.#prefix;
  }

  get path(): string {
    return this.#path;
  }

  get route(): string {
    return joinUrl(this.#prefix, this.#path);
  }

  get url(): string {
    return this.#url;
  }
}

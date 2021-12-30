import { Component } from "../deps.ts";
import { joinUrl } from "./utils.ts";

export interface RoutableType<T, S> {
  new (props: T & RoutableOptions): Routable<T, S>;
}

export interface RoutableOptions {
  _prefix?: string;
  _path?: string;
  _url?: string;
}

export class Routable<T = unknown, S = unknown>
  extends Component<T & RoutableOptions, S> {
  readonly #prefix: string;
  readonly #path: string;
  readonly #url: string;

  constructor(props: T & RoutableOptions) {
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

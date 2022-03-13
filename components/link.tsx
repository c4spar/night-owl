/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";

export interface LinkOptions {
  children: Children;
  href?: string;
  class?: string;
  onclick?: string;
}

export class Link extends Component<LinkOptions> {
  render() {
    const target = this.props.href?.startsWith("https://") ||
        this.props.href?.startsWith("http://")
      ? "_blank"
      : undefined;

    return (
      <a
        class={this.props.class ?? ""}
        href={this.props.href}
        target={target}
        onclick={this.props.onclick}
      >
        {render(this.props.children)}
      </a>
    );
  }
}

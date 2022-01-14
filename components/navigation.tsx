/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";

export interface NavigationOptions {
  children: Children;
  class?: string;
}

export class Navigation extends Component<NavigationOptions> {
  render() {
    return (
      <nav class={`${this.props.class ?? ""} ${tw`w-full flex flex-col p-2`}`}>
        {render(this.props.children)}
      </nav>
    );
  }
}

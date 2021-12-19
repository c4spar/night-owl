/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";

export interface NavigationOptions {
  children: Children;
}

export class Navigation extends Component<NavigationOptions> {
  render() {
    return (
      <nav class={tw`w-full flex flex-col`}>
        {render(this.props.children)}
      </nav>
    );
  }
}

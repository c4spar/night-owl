/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";

export interface SidebarOptions {
  position: "left" | "right";
  children: Children;
  class?: string;
}

export class Sidebar extends Component<SidebarOptions> {
  render() {
    const contentPositionTop = "4.8125rem";
    const sideBarWidth = "19.5rem";
    const contentWidth = "90rem";
    return (
      <div
        class={`${this.props.class} ${tw`
          fixed overflow-y-auto
          bottom-0 top-[${contentPositionTop}]
          ${this.props.position}-[max(0px,calc(50%-(${contentWidth}/2)))]
          py-10 px-8
          w-[${sideBarWidth}]
        `}`}
      >
        {render(this.props.children)}
      </div>
    );
  }
}

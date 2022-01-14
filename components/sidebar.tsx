/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";
import { styles } from "../mod.ts";

export interface SidebarOptions {
  position: "left" | "right";
  children: Children;
  class?: string;
  width: number;
  top: number;
  contentWidth: number;
}

export class Sidebar extends Component<SidebarOptions> {
  render() {
    return (
      <div
        class={`${this.props.class} ${tw`
          ${styles.transform.primary} 
          fixed overflow-y-auto
          bottom-0 top-[${this.props.top}rem]
          ${this.props.position}-[max(0px,calc(50%-(${this.props.contentWidth}rem/2)))]
          py-10 px-8
          w-[${this.props.width}rem]
          hidden ${this.props.position === "left" ? "lg:block" : "xl:block"}
        `}`}
      >
        {render(this.props.children)}
      </div>
    );
  }
}

/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { Children } from "../lib/types.ts";
import { styles } from "../mod.ts";

export interface SidebarOptions {
  position: "left" | "right";
  children: Children;
  class?: string;
  width: number;
  contentWidth: number;
  isBranch: boolean;
}

export class Sidebar extends Component<SidebarOptions> {
  render() {
    return (
      <div
        class={`${this.props.class ?? ""} ${tw`
          ${styles.bg.primary} ${styles.transform.primary}
          fixed overflow-y-auto
          bottom-0 top-[8.5rem] ${
          this.props.isBranch ? "md:top-[11.2rem]" : "md:top-[5.2rem]"
        }
          ${this.props.position}-[max(0px,calc(50%-(${this.props.contentWidth}rem/2)))]
          py-10 px-8
          w-[${this.props.width}rem]
        `}`}
      >
        {render(this.props.children)}
      </div>
    );
  }
}

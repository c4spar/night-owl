/** @jsx h */

import { Component, h, render, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { Children } from "../lib/types.ts";
import { Iconify } from "./iconify.tsx";
import { Link } from "./link.tsx";

export interface ButtonOptions {
  children: Children;
  class?: string;
  onclick?: string;
}

export class Button extends Component<ButtonOptions> {
  render() {
    return (
      <Link
        onclick={this.props.onclick}
        class={`${tw`${styles.transform.secondary}
          font-bold select-none cursor-pointer
          inline-flex items-center focus:outline-none
          rounded-lg hover:shadow
          px-3 py-3 justify-center
          ${styles.bg.secondary} ${styles.text.secondary}
          hover:${styles.bg.tertiary}
          hover:${styles.text.primary}`}
          ${this.props.class ?? ""}`}
      >
        {render(this.props.children)}
      </Link>
    );
  }
}

export interface RoundedIconButtonOptions {
  icon: string;
  class?: string;
  onclick?: string;
}

export class RoundedIconButton extends Component<RoundedIconButtonOptions> {
  render() {
    return (
      <Link
        onclick={this.props.onclick}
        class={`${tw`${styles.transform.primary}
          select-none cursor-pointer
          inline-flex items-center focus:outline-none
          rounded-full shadow-lg
          p-5 text-2xl justify-center
          transition-colors duration-150
          ${styles.bg.secondary} ${styles.text.secondary}
          hover:${styles.bg.tertiary}
          hover:${styles.text.primary}`}
          ${this.props.class ?? ""}`}
      >
        <Iconify icon={this.props.icon} />
      </Link>
    );
  }
}

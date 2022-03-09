/** @jsx h */

import { Component, h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { Iconify } from "./iconify.tsx";

export interface SecondaryPageNavigationButtonOptions {
  icon: string;
  class?: string;
  onclick?: string;
}

export class RoundedIconButton
  extends Component<SecondaryPageNavigationButtonOptions> {
  render() {
    return (
      <button
        onclick={this.props.onclick}
        class={`${tw`inline-flex items-center focus:outline-none
           rounded-full shadow-lg
           p-5 text-2xl justify-center
           transition-colors duration-150
           ${styles.bg.secondary} hover:(${styles.bg.tertiary})
           ${styles.text.secondary} hover:(${styles.text.primary})`}
           ${this.props.class ?? ""}`}
      >
        <Iconify icon={this.props.icon} />
      </button>
    );
  }
}

/** @jsx h */

import { Component, h, render } from "../deps.ts";

export interface IconifyOptions {
  icon: string;
  class?: string;
}

export class Iconify extends Component<IconifyOptions> {
  render() {
    return (
      <span
        class={`iconify ${this.props.class}`}
        data-icon={this.props.icon}
      >
      </span>
    );
  }
}

/** @jsx h */

import { Component, h, tw } from "../deps.ts";

export interface CodeOptions {
  id?: string;
  class?: string;
  code: string;
  lang?: string;
  rounded?: boolean;
}

export class Code extends Component<CodeOptions> {
  render() {
    return (
      <div
        id={this.props.id}
        class={`${tw`flex-grow bg-[#1c1d21] ${
          this.props.rounded ? "rounded-xl shadow-xl overflow-y-auto" : ""
        }`} ${this.props.class}`}
      >
        <pre>
          <code
            class={`${this.props.lang ? `language-${this.props.lang}` : ""} ${tw
              `font-mono py-3 text-sm overflow-visible`}`}
          >
            {this.props.code.trim()}
          </code>
        </pre>
      </div>
    );
  }
}
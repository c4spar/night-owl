/** @jsx h */

import { Component, h, tw } from "../deps.ts";
import { transformGpu } from "../lib/styles.ts";

export interface CodeOptions {
  code: string;
}

export class Code extends Component<CodeOptions> {
  render() {
    return (
      <code
        class={tw`py-[0.1rem] px-2 rounded-lg
           bg(indigo-50 dark:gray-900)
           text-purple(500 dark:400)
           font-mono overflow-visible
           shadow-code
           ${transformGpu}`}
        dangerouslySetInnerHTML={{ __html: this.props.code }}
      />
    );
  }
}

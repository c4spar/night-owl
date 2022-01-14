/** @jsx h */

import { Component, h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";

export interface CodeOptions {
  code: string;
}

export class Code extends Component<CodeOptions> {
  render() {
    return (
      <code
        class={tw`py-[0.1rem] px-2 rounded-lg
           ${styles.bg.secondary}
           ${styles.text.accent}
           ${styles.transform.primary}
           font-mono overflow-visible
           shadow(code dark:code-dark)`}
        dangerouslySetInnerHTML={{ __html: this.props.code }}
      />
    );
  }
}

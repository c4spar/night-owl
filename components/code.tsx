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
           ${styles.text.accentSecondary}
           ${styles.transform.primary}
           font-mono overflow-visible`}
        dangerouslySetInnerHTML={{ __html: this.props.code }}
      />
    );
  }
}

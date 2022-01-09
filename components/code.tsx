/** @jsx h */

import { Component, h, htmlEntities, lowlight, toHtml, tw } from "../deps.ts";
import { syntaxHighlighting } from "../lib/styles.ts";

export interface CodeOptions {
  id?: string;
  class?: string;
  code: string;
  lang: string;
  rounded?: boolean;
}

export class Code extends Component<CodeOptions> {
  render() {
    const tree = lowlight.highlight(
      this.props.lang,
      htmlEntities.decode(this.props.code.trim()),
      {
        prefix: "code-",
      },
    );
    const html = toHtml(tree);
    return (
      <div
        id={this.props.id}
        class={`${tw`flex-grow bg(indigo-50 dark:gray-900) my-5 p-4 ${
          this.props.rounded ? "rounded-xl shadow-lg overflow-y-auto" : ""
        } ${syntaxHighlighting}`} ${this.props.class}`}
      >
        <pre>
          <code
            class={"language-" + this.props.lang}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>
    );
  }
}

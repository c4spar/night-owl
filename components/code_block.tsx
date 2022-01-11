/** @jsx h */

import { Component, h, htmlEntities, lowlight, toHtml, tw } from "../deps.ts";
import { syntaxHighlighting, transformGpu } from "../lib/styles.ts";

export interface CodeBlockOptions {
  code: string;
  id?: string;
  class?: string;
  lang?: string;
  rounded?: boolean;
  margin?: boolean;
}

export class CodeBlock extends Component<CodeBlockOptions> {
  render() {
    const html = this.props.lang
      ? toHtml(lowlight.highlight(
        this.props.lang,
        htmlEntities.decode(this.props.code),
        {
          prefix: "code-",
        },
      ))
      : this.props.code;

    return (
      <div
        id={this.props.id}
        class={`${tw`flex-grow text-sm bg(indigo-50 dark:gray-900) p-4 ${
          this.props.margin === false ? "" : "my-5"
        } ${
          this.props.rounded ? "rounded-xl shadow-lg overflow-y-auto" : ""
        } ${transformGpu} ${syntaxHighlighting}`} ${this.props.class ?? ""}`}
      >
        <pre>
          <code
            class={`language-${this.props.lang}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>
    );
  }
}

/** @jsx h */

import {
  Component,
  h,
  htmlEntities,
  log,
  lowlight,
  toHtml,
  tw,
} from "../deps.ts";
import { styles, syntaxHighlighting } from "../lib/styles.ts";

export interface CodeBlockOptions {
  code: string;
  id?: string;
  class?: string;
  lang?: string;
  rounded?: boolean;
  margin?: boolean;
  dark?: boolean;
}

export class CodeBlock extends Component<CodeBlockOptions> {
  render() {
    const lang = this.props.lang === "jsonc" ? "json" : this.props.lang;
    let html: string | undefined;

    try {
      html = lang
        ? toHtml(lowlight.highlight(
          lang,
          htmlEntities.decode(this.props.code),
          {
            prefix: "code-",
          },
        ))
        : this.props.code;
    } catch (error: unknown) {
      log.error(error);
      html = this.props.code;
    }

    return (
      <div
        id={this.props.id}
        class={`${this.props.class ?? ""} ${tw`flex-grow text-sm p-4 ${
          this.props.margin === false ? "" : "my-5"
        } ${
          this.props.rounded ? "rounded-xl overflow-y-auto" : ""
        } ${styles.bg.secondary} ${styles.text.primary} ${styles.transform.primary} ${syntaxHighlighting}`}`}
      >
        <pre>
          <code
            class={`language-${lang}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>
    );
  }
}

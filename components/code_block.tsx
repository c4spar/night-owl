/** @jsx h */

import {
  apply,
  Component,
  css,
  h,
  htmlEntities,
  log,
  lowlight,
  toHtml,
  tw,
} from "../deps.ts";
import { styles } from "../lib/styles.ts";

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
        } ${styles.bg.secondary} ${styles.text.primary} ${styles.transform.primary} ${this.#css()}`}`}
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

  #css() {
    return css({
      ".language-console": apply`${styles.text.accentPrimary}`,
      ".language-console .bash": styles.text.secondary,
      ".code-comment": apply`text-gray(500 dark:400)`,
      ".code-property": apply`text-green(700 dark:300)`,
      ".code-function": apply`text-green(700 dark:300)`,
      ".code-literal": apply`text-cyan(600 dark:400) font-bold`,
      ".code-keyword": apply`text-purple(700 dark:400) font-italic`,
      ".code-operator": apply`text-purple(700 dark:400)`,
      ".code-variable.code-language": apply`text-purple(700 dark:400)`,
      ".code-number": apply`text-indigo(600 dark:400)`,
      ".code-doctag": apply`text-indigo(600 dark:400)`,
      ".code-regexp": apply`text-red(700 dark:300)`,
      ".code-meta, .code-string": apply`text-yellow(500 dark:200)`,
      ".code-meta": apply`font-bold`,
      ".language-console .code-meta": apply`select-none`,
      ".code-type": apply`text-cyan(600 dark:400) font-italic`,
      ".code-built_in": apply`text-cyan(600 dark:400) font-italic`,
    });
  }
}

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
import { Button } from "./buttons.tsx";

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

    const id = this.props.id ??
      "code-block-" + (Math.random() + Date.now()) * 99999;
    const code = this.props.code.trim();

    try {
      html = lang
        ? toHtml(lowlight.highlight(
          lang,
          htmlEntities.decode(code),
          {
            prefix: "code-",
          },
        ))
        : code;
    } catch (error: unknown) {
      log.error(error);
      html = code;
    }
    return (
      <div
        id={id}
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
          <Button
            onclick={`navigator.clipboard.writeText(document.querySelector("#${id} code").textContent.trim().replace(/^\\$\\s+/g, '')); this.textContent = "Copied!"; setTimeout(() => this.textContent = "Copy", 1500);`}
            class={"copy-button " + tw` absolute ${
              code.split("\n").length > 1
                ? "bottom-2"
                : "bottom-1"
            } right-2 ${styles.bg.primary} hover:${styles.bg.tertiary}`}
          >
            Copy
          </Button>
        </pre>
      </div>
    );
  }

  #css() {
    return css({
      "pre > .copy-button": apply`hidden`,
      "pre:hover > .copy-button": apply`block`,
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

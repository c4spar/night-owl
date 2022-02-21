/** @jsx h */

import { apply, Component, comrak, css, h, join, render, tw } from "../deps.ts";
import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../lib/styles.ts";
import { pathToUrl } from "../lib/utils.ts";
import { Code } from "./code.tsx";
import { CodeBlock } from "./code_block.tsx";

export interface MarkdownOptions {
  file: SourceFile;
  files: Array<SourceFile>;
  sanitize?: (file: SourceFile) => string;
}

export class Markdown extends Component<MarkdownOptions> {
  render() {
    const markdown: string = this.props.sanitize?.(this.props.file) ??
      this.props.file.content;

    let html = comrak.markdownToHTML(markdown, {
      render: {
        escape: false,
        githubPreLang: false,
        hardbreaks: false,
        unsafe: true,
      },
      parse: {
        smart: true,
      },
      extension: {
        autolink: true,
        table: true,
        descriptionLists: true,
        footnotes: true,
        strikethrough: true,
        superscript: true,
        tasklist: true,
        tagfilter: true,
        headerIDs: "",
      },
    });

    html = html
      // Rewrite links to markdown files:
      //   ./01_getting_started.md -> ./getting-started
      .replace(
        /<a href="([^"]+)/g,
        (match, url) => {
          if (url.startsWith("http:") || url.startsWith("https:")) {
            return match;
          }
          const matched = url.match(/^(\.\/)?(.+\.md)(#.+)?$/);
          if (!matched) {
            return match;
          }
          const [__, ___, path, hash] = matched;
          const filePath = join(this.props.file.dirName, path);
          const file = this.props.files.find((file) => file.path === filePath);

          if (!file) {
            throw new Error(`File not found: ${filePath}`);
          }

          return `<a href="${file.route + (hash ?? "")}`;
        },
      )
      // Replace local image urls with data urls:
      .replace(
        /<img src="([^"]+)"/g,
        (src, path) => {
          if (src.startsWith("http:") || src.startsWith("https:")) {
            return src;
          }
          const filePath = join(this.props.file.dirName, "/", path);
          const file = this.props.file.assets.find((asset) =>
            filePath === asset.path
          );
          if (!file) {
            throw new Error(`Image not found: ${filePath}`);
          }
          return `<img src="${file.content}"`;
        },
      )
      // Add anchor link:
      .replace(
        /(<(h1|h2|h3|h4|h5)>)(<a href="(#[^"]+))/g,
        (_, hTag, __, aTag, href) =>
          `${hTag}<a href="${href}" class="anchor-link"></a>${aTag}`,
      )
      // Add target="_black" to external links:
      .replace(
        /<a href="((http|https):\/\/.+)">/g,
        (_, url) => `<a href="${url}" target="_blank">`,
      )
      // Syntax highlighting: inline code
      .replace(
        /<code>([^<]+)<\/code>/g,
        (_, code) => {
          return render(<Code code={code} />);
        },
      )
      // Syntax highlighting: code block
      .replace(
        /<pre><code class="language-([^"]+)">([^<]+)<\/code><\/pre>/g,
        (_, lang, code) => {
          return render(<CodeBlock rounded lang={lang} code={code} />);
        },
      );

    const markdownStyles = css(
      {
        "ul": apply`list-disc ml-5 my-5`,
        "p": apply`${styles.text.secondary} ${styles.transform.primary}`,
        "blockquote": apply
          `p-4 rounded-xl ${styles.bg.accent} ${styles.transform.primary}`,
        "blockquote p:first-child": apply`mt-0`,
        "blockquote p:last-child": apply`mb-0`,
        "strong": apply`${styles.text.primary}`,
      },
    );

    return (
      <div
        class={tw`w-full ${markdownStyles}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

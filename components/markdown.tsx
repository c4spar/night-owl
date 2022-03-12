/** @jsx h */

import {
  apply,
  Component,
  comrak,
  css,
  h,
  join,
  render,
  theme,
  tw,
} from "../deps.ts";
import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../lib/styles.ts";
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
      )
      .replace(
        /<blockquote>/g,
        `<blockquote>
          <div class="${tw`flex`}">
            <div class="${tw`
              absolute -bottom-7 -right-10
              self-center flex-none mr-4 font-primary font-bold
              text-center text-blue-400
              text-[4rem] w-20 h-20 leading-[4.6rem]
              rounded-full border-8 border-blue-400 opacity(20 dark:10)
              ${styles.transform.primary}
            `}">i</div>
          <div>`,
      )
      .replace(/<\/blockquote>/g, "</div></div></blockquote>");

    return (
      <div
        class={tw`w-full ${this.#css()}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  #css() {
    const headlines = css({
      "h1, h2, h3, h4, h5": css(
        apply`flex relative w-[fit-content]`,
        {
          "&:hover": {
            ".anchor-link": {
              "&::before": {
                visibility: "visible",
              },
            },
          },
        },
      ),
      "h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child":
        apply`mt-0`,
      "h1": apply`left-[-2rem] mb-5 mr-8`,
      "h2": apply`left-[-1.75rem] mt-10 mr-7`,
      "h3": apply`left-[-1.5rem] mt-10 mr-6`,
      "h4": apply`left-[-1.4rem] mb-2 mt-10 mr-5`,
      "h5": apply`left-[-1.35rem] mb-1 mt-10 mr-4`,
      ".anchor": apply`block relative -top-28 invisible`,
      "h1 .anchor-link::before": apply`text-xl sm:text-2xl`,
      "h2 .anchor-link::before": apply`text-lg sm:text-xl`,
      "h3 .anchor-link::before": apply`text-base sm:text-lg`,
      "h4 .anchor-link::before": apply`text-sm sm:text-base`,
      "h5 .anchor-link::before": apply`text-xs sm:text-sm`,
      ".anchor-link": {
        "&::before": {
          fontFamily: theme("fontFamily.awesome"),
          content: '"\\f0c1"',
          fontWeight: 900,
          marginRight: ".5rem",
          visibility: "hidden",
        },
      },
    });

    const paragraph = css({
      "p": apply`my-5 ${styles.text.secondary} ${styles.transform.primary}`,
    });

    const list = css({
      "ul": apply
        `pl-4 ml-5 my-5 list-disc ${styles.text.secondary} ${styles.transform.primary}`,
      "ul:not(ul ul)": apply`my-5`,
      "ul, li > p": apply`m-0`,
    });

    const table = css({
      "table, th, td": apply`${styles.transform.primary}
        border-collapse border border-gray(300 dark:700)`,
      "th, td": apply`py-2 px-3`,
      "tr": apply`even:bg-gray(100 dark:800) ${styles.transform.primary}`,
    });

    const images = css({
      "p img": apply`my-5`,
    });

    const blockquote = css({
      "blockquote": apply`
        ${styles.bg.accent} ${styles.transform.primary}
        my-5 rounded-xl relative overflow-hidden`,
      "blockquote > div": apply`p-4 border-l-8 border-blue-400`,
      "blockquote > div > div > *:first-child": apply`mt-0`,
      "blockquote > div > div > *:last-child": apply`mb-0`,
    });

    const links = css({
      "a:not(nav a,header a), a:not(nav a,header a) code": apply
        `text-blue(500 dark:400 hover:(600 dark:500))`,
      'a[href*="//"]:not(nav a)': {
        "&::after": {
          fontFamily: theme("fontFamily.awesome"),
          color: theme("colors.blue.500"),
          fontSize: "0.7rem",
          content: '"\\f35d"',
          fontWeight: 900,
          position: "relative",
          marginLeft: "0.4rem",
          top: "-2px",
        },
      },
    });

    return css(
      headlines,
      paragraph,
      list,
      table,
      images,
      blockquote,
      links,
    );
  }
}

/** @jsx h */
import {
  apply,
  Component,
  comrak,
  css,
  Fragment,
  h,
  Helmet,
  tw,
} from "../deps.ts";
import { syntaxHighlighting, textMain, transformGpu } from "../lib/styles.ts";
import { joinUrl, pathToUrl } from "../lib/utils.ts";

export interface MarkdownOptions {
  content: string;
  prefix: string;
}

export class Markdown extends Component<MarkdownOptions> {
  render() {
    let html = comrak.markdownToHTML(this.props.content, {
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
      // rewrite links to markdown files:
      //   ./01_getting_started.md -> {prefix}/getting-started
      .replace(
        /<a href="(.+\.md)">/g,
        (_, path) =>
          `<a href="${joinUrl(this.props.prefix, pathToUrl(path))}">`,
      )
      // add anchor link
      .replace(
        /(<(h1|h2|h3)>)(<a href="(#[^"]+))/g,
        (_, hTag, __, aTag, href) =>
          `${hTag}<a href="${href}" class="anchor-link"></a>${aTag}`,
      )
      // add target="_black" to external links
      .replace(
        /<a href="((http|https):\/\/.+)">/g,
        (_, url) => `<a href="${url}" target="_blank">`,
      );

    const markdownStyles = css(
      syntaxHighlighting,
      {
        "ul": apply`list-disc ml-5 my-5`,
        "p": apply`text-gray-600 dark:text-gray-300 ${transformGpu}`,
        "strong": apply`${textMain}`,
        "pre": apply`my-5 rounded-xl shadow-lg overflow-y-auto`,
      },
    );

    return (
      <Fragment>
        <Helmet>
          <script type="application/javascript" src="/highlight.min.js" />
          <script>hljs.highlightAll();</script>
        </Helmet>

        <div
          class={tw`w-full ${markdownStyles}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Fragment>
    );
  }
}

/** @jsx h */

import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../mod.ts";
import { Navigation } from "./navigation.tsx";
import { Component, comrak, h, render, tw } from "../deps.ts";

export interface SecondaryPageNavigationOptions {
  file: SourceFile;
}

export class SecondaryPageNavigation
  extends Component<SecondaryPageNavigationOptions> {
  render() {
    const html = comrak.markdownToHTML(this.props.file.content);

    const headlines = html.match(/<h(1|2|3|4|5)>([^<]+)<\/h\1>/g)?.map(
      (h) => {
        const [_, size, label] = h.match(/<h(1|2|3|4|5)>([^<]+)<\/h\1>/) ?? [];
        return {
          size: Number(size),
          label,
          href: "#" + label?.toLowerCase().replace(/\s/g, "-"),
        };
      },
    );

    return (
      <Navigation
        class={tw
          `${styles.transform.primary} ${styles.bg.secondary} rounded-xl`}
      >
        {render(headlines?.map((headline) => {
          const rem = headline.size;
          const marginLeft = `pl-[${rem}rem]`;
          const bold = headline.size === 1 ? "font-bold" : "";
          return (
            <a
              class={`${tw`p-3 w-full ${bold} ${marginLeft}`}`}
              href={headline.href}
            >
              {headline.label}
            </a>
          );
        }))}
      </Navigation>
    );
  }
}

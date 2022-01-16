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
        const [_, size, name] = h.match(/<h(1|2|3|4|5)>([^<]+)<\/h\1>/) ?? [];
        return {
          size: Number(size),
          name,
          href: "#" + name?.toLowerCase()
            .replace(/[\s+]+/g, "-")
            .replace(/[\/.]+/g, ""),
        };
      },
    );

    if (headlines) {
      const minSize = headlines.reduce(
        (prev, h) => h.size < prev ? h.size : prev,
        Infinity,
      ) ?? 0;

      for (const headline of headlines) {
        headline.size = headline.size - minSize + 1;
      }
    }

    return (
      <Navigation
        class={tw
          `${styles.transform.primary} ${styles.bg.secondary} rounded-xl`}
      >
        {render(headlines?.map((headline) => {
          const marginLeft = `pl-[${headline.size}rem]`;
          const bold = headline.size === 1 ? "font-bold" : "";
          return (
            <a
              class={`${tw`p-3 w-full ${bold} ${marginLeft}`}`}
              href={headline.href}
            >
              {headline.name}
            </a>
          );
        }))}
      </Navigation>
    );
  }
}

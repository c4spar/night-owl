/** @jsx h */

import { SourceFile } from "../lib/source_file.ts";
import { Navigation } from "./navigation.tsx";
import { Component, h, render, tw } from "../deps.ts";

export interface SecondaryPageNavigationOptions {
  file: SourceFile;
}

export class SecondaryPageNavigation
  extends Component<SecondaryPageNavigationOptions> {
  render() {
    const headlines = this.props.file.content.match(/\n?#+\s+([^\n]+)/g)?.map(
      (h) => {
        const label = h.match(/#+\s+([^\n]+)/)?.[1];
        return {
          size: h.split("#").length - 1,
          label,
          href: "#" + label?.toLowerCase().replace(/\s/g, "-"),
        };
      },
    );

    return (
      <Navigation>
        {render(headlines?.map((headline) => {
          const rem = headline.size - 1;
          const marginLeft = `pl-[${rem}rem]`;
          return (
            <a
              class={`${tw`p-3 w-full ${marginLeft}`}`}
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

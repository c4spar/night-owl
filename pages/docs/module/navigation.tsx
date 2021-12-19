/** @jsx h */

import { Navigation } from "../../../components/navigation.tsx";
import { Component, h, tw } from "../../../deps.ts";
import { FileOptions } from "../../../lib/resource.ts";
import { capitalize, joinUrl } from "../../../lib/utils.ts";

export interface DocumentationNavigationOptions {
  docs: Array<FileOptions>;
  prefix: string;
}

export class DocumentationNavigation
  extends Component<DocumentationNavigationOptions> {
  render() {
    return (
      <Navigation>
        {this.props.docs.map((file) => {
          const marginLeft = "ml-" + ((file.path.match(/\//g)?.length ?? 0) - 2) * 4;
          return (
            <a
              class={`${tw`p-3 w-full ${marginLeft}`}`}
              href={joinUrl(this.props.prefix, file.routeName)}
            >
              {this.#getLabel(file.routeName)}
            </a>
          );
        })}
      </Navigation>
    );
  }

  #getLabel(routeName: string): string {
    return capitalize(
      routeName.replace(/^\//, "")
        .replace(/-/g, " "),
    );
  }
}

/** @jsx h */

import { Navigation } from "../../../components/navigation.tsx";
import { Component, h, tw } from "../../../deps.ts";
import { FileOptions } from "../../../lib/resource.ts";
import { joinUrl } from "../../../lib/utils.ts";

export interface ModuleNavigationOptions {
  docs: Array<FileOptions>;
  prefix: string;
}

export class ModuleNavigation extends Component<ModuleNavigationOptions> {
  render() {
    return (
      <Navigation>
        {this.props.docs.map((file) => {
          const marginLeft = "ml-" +
            ((file.path.match(/\//g)?.length ?? 0) - 2) * 4;
          return (
            <a
              class={`${tw`p-3 w-full ${marginLeft}`}`}
              href={joinUrl(this.props.prefix, file.routeName)}
            >
              {file.label}
            </a>
          );
        })}
      </Navigation>
    );
  }
}

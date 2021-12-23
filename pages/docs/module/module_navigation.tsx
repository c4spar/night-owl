/** @jsx h */

import { Navigation } from "../../../components/navigation.tsx";
import { Component, h, tw } from "../../../deps.ts";
import { FileOptions } from "../../../lib/resource.ts";

export interface ModuleNavigationOptions {
  docs: Array<FileOptions>;
  prefix: string;
}

export class ModuleNavigation extends Component<ModuleNavigationOptions> {
  render() {
    return (
      <Navigation>
        {this.props.docs.map((file, i, docs) => {
          const hasDuplicateRoutes = this.props.docs.find(
            (f) => f !== file && f.route === file.route,
          );

          if (file.isDirectory && hasDuplicateRoutes) {
            return null;
          }

          const isRootFile = file.routePrefix === this.props.prefix;
          const bold = isRootFile || hasDuplicateRoutes ? "font-bold" : "";
          const rem = file.routePrefix.split("/").length -
            this.props.prefix.split("/").length;
          const marginLeft = `pl-[${rem}rem]`;

          return file.content
            ? (
              <a
                class={tw`p-3 w-full ${marginLeft} ${bold}`}
                href={file.route}
              >
                {file.label}
              </a>
            )
            : (
              <div
                class={`${tw`font-bold p-3 w-full ${marginLeft}`}`}
              >
                {file.label}
              </div>
            );
        })}
      </Navigation>
    );
  }
}

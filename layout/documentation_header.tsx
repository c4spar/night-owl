/** @jsx h */

import { Link } from "../components/link.tsx";
import { Component, h, render, tw } from "../deps.ts";
import { Config } from "../lib/config.ts";
import { joinUrl } from "../lib/utils.ts";

export interface DocumentationHeaderOptions {
  prefix: string;
}

export class DocumentationHeader extends Component<DocumentationHeaderOptions> {
  render() {
    return (
      <nav class={tw`p-5 flex`}>
        <div
          class={tw`flex flex-grow flex-col md:flex-row items-center md:ml-auto
              text-base justify-center space-x-3`}
        >
          {Config.modules.map((module) =>
            render(
              <Link href={joinUrl(this.props.prefix, module.name)}>
                {module.label}
              </Link>,
            )
          )}
        </div>
      </nav>
    );
  }
}

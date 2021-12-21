/** @jsx h */

import { Link } from "../../components/link.tsx";
import { Component, h, render, tw } from "../../deps.ts";
import { FileOptions } from "../../lib/resource.ts";

export interface DocumentationHeaderOptions {
  prefix: string;
  modules: Array<FileOptions>;
}

export class DocumentationHeader extends Component<DocumentationHeaderOptions> {
  render() {
    return (
      <nav class={tw`p-5 flex`}>
        <div
          class={tw`flex flex-grow flex-col md:flex-row items-center md:ml-auto
              text-base justify-center space-x-3`}
        >
          {this.props.modules.map((module) =>
            render(
              <Link href={module.route}>
                {module.label}
              </Link>,
            )
          )}
        </div>
      </nav>
    );
  }
}

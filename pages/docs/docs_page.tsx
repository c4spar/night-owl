/** @jsx h */

import { h, tw } from "../../deps.ts";
import { Routable } from "../../components/routable.tsx";
import { DocumentationHeader } from "./docs_header.tsx";
import { Module } from "../../lib/config.ts";
import { transformGpu } from "../../lib/styles.ts";

export interface GetStartedPageOptions {
  modules: Array<Module>;
}

export class DocsPage extends Routable<GetStartedPageOptions> {
  render() {
    return (
      <div class={tw`${transformGpu}`}>
        <DocumentationHeader
          prefix={this.prefix}
          modules={this.props.modules}
        />
        <span>Get started page...</span>
      </div>
    );
  }
}

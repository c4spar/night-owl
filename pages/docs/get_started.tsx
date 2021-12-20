/** @jsx h */

import { h, tw } from "../../deps.ts";
import { Page } from "../../components/page.tsx";
import { DocumentationHeader } from "../../layout/documentation_header.tsx";
import { Module } from "../../lib/resource.ts";
import { transformGpu } from "../../lib/styles.ts";

export interface GetStartedPageOptions {
  modules: Array<Module>;
}

export class GetStartedPage extends Page<GetStartedPageOptions> {
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

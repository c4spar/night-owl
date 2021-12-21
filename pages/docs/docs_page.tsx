/** @jsx h */

import { h, tw } from "../../deps.ts";
import { Routable } from "../../components/routable.tsx";
import { FileOptions } from "../../lib/resource.ts";
import { DocumentationHeader } from "./docs_header.tsx";
import { transformGpu } from "../../lib/styles.ts";

export interface GetStartedPageOptions {
  modules: Array<FileOptions>;
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

/** @jsx h */

import { h, tw } from "../../deps.ts";
import { Page } from "../../components/page.tsx";
import { DocumentationHeader } from "../../layout/documentation_header.tsx";
import { transformGpu } from "../../lib/styles.ts";

export class GetStartedPage extends Page {
  render() {
    return (
      <div class={tw`${transformGpu}`}>
        <DocumentationHeader prefix={this.prefix} />
        <span>Get started page...</span>
      </div>
    );
  }
}

/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { FileOptions } from "../lib/resource.ts";
import { getRouteRegex } from "../lib/utils.ts";
import { Selection } from "./selection.tsx";

export interface VersionSelectionOptions {
  file: FileOptions;
  config: AppConfig;
  class?: string;
}

export class VersionSelection extends Component<VersionSelectionOptions> {
  render() {
    return !this.props.file.versions ? <Fragment /> : (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {this.#getScript()}
          </script>
        </Helmet>
        <Selection
          class={this.props.class}
          options={this.props.file.versions.all}
          selected={this.props.file.rev}
          onchange="switchVersion(this.value)"
        />
      </Fragment>
    );
  }

  #getScript(): string {
    if (!this.props.file.versions) {
      return "";
    }
    const regex = getRouteRegex(
      this.props.file.versions.all,
      this.props.config.pages,
    );
    const replace = this.props.config.pages
      ? '"$3@" + version + "$6$8"'
      : '"/" + version + "$5$7"';

    return `
      function switchVersion(version) {
        var url = new URL(window.location.href);
        window.location.href = url.pathname.replace(
          ${regex},
          ${replace},
        ).replace(/\\/+$/, "");
      }`;
  }
}

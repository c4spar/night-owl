/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { getRouteRegex } from "../lib/utils.ts";
import { Selection } from "./selection.tsx";

export interface VersionSelectionOptions {
  config: AppConfig;
  class?: string;
}

export class VersionSelection extends Component<VersionSelectionOptions> {
  render() {
    return (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {this.#getScript()}
          </script>
        </Helmet>
        <Selection
          class={this.props.class}
          options={this.props.config.versions.all}
          selected={this.props.config.selectedVersion}
          onchange="switchVersion(this.value)"
        />
      </Fragment>
    );
  }

  #getScript(): string {
    const regex = getRouteRegex(
      this.props.config.versions.all,
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

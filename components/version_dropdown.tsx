/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { AppConfig } from "../lib/config/config.ts";
import { SourceFile } from "../lib/resource/source_file.ts";
import { getRouteRegex } from "../lib/utils.ts";
import { Dropdown } from "./dropdown.tsx";

export interface VersionDropdownOptions {
  file: SourceFile;
  config: AppConfig;
  class?: string;
}

export class VersionDropdown extends Component<VersionDropdownOptions> {
  render() {
    return !this.props.file.versions ? <Fragment /> : (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {this.#getScript()}
          </script>
        </Helmet>
        <Dropdown
          class={this.props.class}
          options={this.props.file.versions.all}
          selected={this.props.file.rev}
          onchange="switchVersion(this.getAttribute('data-value'))"
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

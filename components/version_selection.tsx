/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { GithubVersions } from "../lib/git.ts";
import { Selection } from "./selection.tsx";

export interface VersionSelectionOptions {
  versions: GithubVersions;
  selectedVersion: string;
  class?: string;
}

export class VersionSelection extends Component<VersionSelectionOptions> {
  render() {
    const versions = this.props.versions.versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|");

    return (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {`
            function switchVersion(version) {
              window.location.href = window.location.href.replace(
                new RegExp("/docs/?((${versions})/?)?"),
                "/docs/" + version + "/",
              );
            }
          `}
          </script>
        </Helmet>
        <Selection
          class={this.props.class}
          options={this.props.versions.versions}
          selected={this.props.selectedVersion}
          onchange="switchVersion(this.value)"
        />
      </Fragment>
    );
  }
}

/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { Selection } from "./selection.tsx";

export interface VersionSelectionOptions {
  versions: Array<string>;
  selectedVersion: string;
  class?: string;
}

export class VersionSelection extends Component<VersionSelectionOptions> {
  render() {
    return (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {`
            function switchVersion(version) {
              window.location.href = window.location.href.replace(
                /\\/docs\\/?(v[0-9]+[^/]*\\/?)?/,
                "/docs/" + version + "/",
              );
            }
          `}
          </script>
        </Helmet>
        <Selection
          class={this.props.class}
          options={this.props.versions}
          selected={this.props.selectedVersion}
          onchange="switchVersion(this.value)"
        />
      </Fragment>
    );
  }
}

/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { FileOptions } from "../lib/resource.ts";
import { Selection } from "./selection.tsx";

export interface ModuleSelectionOptions {
  modules: Array<FileOptions>;
  selectedModule?: string;
  class?: string;
}

export class ModuleSelection extends Component<ModuleSelectionOptions> {
  render() {
    return (
      this.props.modules.length === 0 ? null : (
        <Fragment>
          <Helmet footer>
            <script type="application/javascript">
              {`
              function switchModule(module) {
                window.location.href = window.location.href.replace(
                  /(\\/docs(\\/v[0-9]+[^\\/]*)?)\\/([^\\/]+).*/,
                  "$1/" + module,
                );
              }
          `}
            </script>
          </Helmet>
          <Selection
            class={this.props.class}
            options={this.props.modules.map((module) => ({
              value: module.routeName.replace(/^\/+/, ""),
              label: module.label,
            }))}
            selected={this.props.selectedModule}
            onchange="switchModule(this.value)"
          />
        </Fragment>
      )
    );
  }
}

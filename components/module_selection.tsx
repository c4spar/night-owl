/** @jsx h */

import { Component, Fragment, h, Helmet } from "../deps.ts";
import { Selection, SelectionOption } from "./selection.tsx";

export interface ModuleSelectionOptions {
  modules: Array<SelectionOption>;
  selectedModule?: string;
  class?: string;
}

export class ModuleSelection extends Component<ModuleSelectionOptions> {
  render() {
    return (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">
            {`
              function switchModule(module) {
                console.log(window.location.href);
                window.location.href = window.location.href.replace(
                  /(\\/docs(\\/v[0-9]+[^\\/]*)?)\\/([^\\/]+).*/,
                  "$1/" + module,
                );
                console.log(window.location.href);
              }
          `}
          </script>
        </Helmet>
        <Selection
          class={this.props.class}
          options={this.props.modules}
          selected={this.props.selectedModule}
          onchange="switchModule(this.value)"
        />
      </Fragment>
    );
  }
}

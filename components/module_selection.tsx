/** @jsx h */

import { Component, h } from "../deps.ts";
import { SourceFile } from "../lib/source_file.ts";
import { Selection } from "./selection.tsx";

export interface ModuleSelectionOptions {
  files: Array<SourceFile>;
  selected?: string;
  class?: string;
}

export class ModuleSelection extends Component<ModuleSelectionOptions> {
  render() {
    return (
      this.props.files.length === 0 ? null : (
        <Selection
          class={this.props.class}
          options={this.props.files.map((file) => ({
            value: file.route,
            name: file.name,
          }))}
          selected={this.props.selected}
          onchange="window.location.href = this.value"
        />
      )
    );
  }
}

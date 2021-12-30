/** @jsx h */

import { Component, h } from "../deps.ts";
import { FileOptions } from "../lib/resource.ts";
import { Selection } from "./selection.tsx";

export interface ModuleSelectionOptions {
  files: Array<FileOptions>;
  selected?: string;
  class?: string;
}

export class ModuleSelection extends Component<ModuleSelectionOptions> {
  render() {
    return (
      this.props.files.length === 0 ? null : (
        <Selection
          class={this.props.class}
          options={this.props.files.map((module) => ({
            value: module.route,
            label: module.label,
          }))}
          selected={this.props.selected}
          onchange="window.location.href = this.value"
        />
      )
    );
  }
}

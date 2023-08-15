/** @jsx h */

import { Component, h } from "../deps.ts";
import { SourceFile } from "../lib/resource/source_file.ts";
import { Dropdown } from "./dropdown.tsx";

export interface ModuleDropdownOptions {
  files: Array<SourceFile>;
  selected?: string;
  class?: string;
}

export class ModuleDropdown extends Component<ModuleDropdownOptions> {
  render() {
    return (
      this.props.files.length === 0 ? null : (
        <Dropdown
          class={this.props.class}
          options={this.props.files.map((file) => ({
            value: file.route,
            name: file.name,
          }))}
          selected={this.props.selected}
          onchange="window.location.href = this.getAttribute('data-value')"
        />
      )
    );
  }
}

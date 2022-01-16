/** @jsx h */

import { Component, Fragment, h, render, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";

export interface SelectionOption {
  value: string;
  name: string;
}

export interface SelectionOptions {
  options: Array<string | SelectionOption>;
  selected?: string;
  class?: string;
  onchange?: string;
}

export class Selection extends Component<SelectionOptions> {
  render() {
    return (
      <Fragment>
        <div
          class={`${this.props.class} ${tw`mb-7 relative inline-block w-full`}`}
        >
          <select
            onchange={this.props.onchange}
            class={tw`w-full h-10 pl-3 pr-6
              bg-gray-100 dark:bg-gray-700
              border-1 border-gray-200 dark:border-gray-600 rounded-xl
              appearance-none
              ${styles.transform.primary}`}
          >
            {this.props.options
              .map((value) =>
                typeof value === "string" ? { value, name: value } : value
              )
              .map(({ value, name }) =>
                render(
                  this.props.selected === value
                    ? <option value={value} selected>{name}</option>
                    : <option value={value}>{name}</option>,
                )
              )}
          </select>
          <div
            class={tw
              `absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none`}
          >
            <svg class={tw`w-4 h-4 fill-current`} viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </Fragment>
    );
  }
}

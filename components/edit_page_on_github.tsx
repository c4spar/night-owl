/** @jsx h */

import { tw } from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind.js";
import { h } from "https://deno.land/x/nano_jsx@v0.0.26/core.ts";
import { Component } from "../deps.ts";
import { styles } from "../lib/styles.ts";

export interface EditPageOnGithubOptions {
  path: string;
  repository: string;
  rev: string;
}

export class EditPageOnGithub extends Component<EditPageOnGithubOptions> {
  render() {
    return (
      <div
        class={tw`
          mt-12 pt-6 text-right
          border-t border-gray-200 dark:border-gray-700
          ${styles.transform.primary}`}
      >
        <a
          class={tw`mt-10 text-sm`}
          href={`https://github.com/${this.props.repository}/edit/${this.props.rev}/${this.props.path}`}
          target="_blank"
        >
          Edit this page on GitHub
        </a>
      </div>
    );
  }
}

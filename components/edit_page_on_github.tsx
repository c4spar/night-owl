/** @jsx h */

import { tw } from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind.js";
import { h } from "https://deno.land/x/nano_jsx@v0.0.26/core.ts";
import { Component } from "../deps.ts";
import { transformGpu } from "../lib/styles.ts";

export interface EditPageOnGithubOptions {
  path: string;
  repository: string;
}

export class EditPageOnGithub extends Component<EditPageOnGithubOptions> {
  render() {
    return (
      <div
        class={tw`
          mt-12 pt-6 text-right
          border-t border-gray-200 dark:border-gray-700
          ${transformGpu}`}
      >
        <a
          class={tw`mt-10 text-sm`}
          href={`https://github.com/${this.props.repository}/edit/main/${this.props.path}`}
          target="_blank"
        >
          Edit this page on GitHub
        </a>
      </div>
    );
  }
}

/** @jsx h */

import { Component, h, tw } from "../deps.ts";
import { Link } from "./link.tsx";

export interface EditPageOnGithubOptions {
  path: string;
  repository: string;
  rev: string;
  class?: string;
}

export class EditPageOnGithub extends Component<EditPageOnGithubOptions> {
  render() {
    return (
      <Link
        class={`${tw`text-sm`} ${this.props.class ?? ""}`}
        href={`https://github.com/${this.props.repository}/edit/${this.props.rev}/${this.props.path}`}
      >
        Edit this page on GitHub
      </Link>
    );
  }
}

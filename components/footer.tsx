/** @jsx h */

import { Component, Fragment, h, tw } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../lib/styles.ts";
import { EditPageOnGithub } from "./edit_page_on_github.tsx";
import { Link } from "./link.tsx";

export interface FooterOptions {
  file: SourceFile;
  config: AppConfig;
}

export class Footer extends Component<FooterOptions> {
  render() {
    const index = this.props.config.sourceFiles.findIndex(
      (sourceFile) => sourceFile === this.props.file,
    );
    const prevFile: SourceFile | undefined = this.#getPrevFile(index);
    const nextFile: SourceFile | undefined = this.#getNextFile(index);
    const repo = this.props.file.repository ?? this.props.config.repository;

    return (
      <div class={tw`space-y-6 my-12`}>
        <div
          class={tw`flex ${styles.transform.primary}`}
        >
          {prevFile
            ? (
              <Link
                href={prevFile.route}
              >
                ← {prevFile.name}
              </Link>
            )
            : null}

          {nextFile
            ? (
              <Link
                href={nextFile.route}
                class={tw`ml-auto ${styles.text.primary}`}
              >
                {nextFile.name} →
              </Link>
            )
            : null}
        </div>

        <div class={tw`flex border-t border-gray-200 dark:border-gray-700`} />

        {repo
          ? (
            <div class={tw`flex`}>
              <EditPageOnGithub
                path={this.props.file.path}
                repository={repo}
                rev={this.props.config.rev}
                class={tw`ml-auto`}
              />
            </div>
          )
          : null}
      </div>
    );
  }

  #getPrevFile(index: number): SourceFile | undefined {
    return this.#getFile(index, -1);
  }

  #getNextFile(index: number): SourceFile | undefined {
    return this.#getFile(index, 1);
  }

  #getFile(index: number, step = -1): SourceFile | undefined {
    if (!this.props.config.sourceFiles[index + step]) {
      return undefined;
    }
    if (
      this.props.config.sourceFiles[index + step].route === this.props.file.route
    ) {
      return this.#getFile(index + step);
    }
    return this.props.config.sourceFiles[index + step];
  }
}

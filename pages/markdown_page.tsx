/** @jsx h */

import { EditPageOnGithub } from "../components/edit_page_on_github.tsx";
import { Markdown } from "../components/markdown.tsx";
import { Sidebar } from "../components/sidebar.tsx";
import { VersionSelection } from "../components/version_selection.tsx";
import { Component, Fragment, h, tw } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../lib/styles.ts";
import { PageNavigation } from "../components/page_navigation.tsx";
import { SecondaryPageNavigation } from "../components/secondary_page_navigation.tsx";

export interface MarkdownPageOptions {
  config: AppConfig;
  file: SourceFile;
}

export class MarkdownPage extends Component<MarkdownPageOptions> {
  #headerHeight = 5.2;
  #sideBarWidth = 21;
  #contentWidth = 90;

  render() {
    let file = this.props.file;
    if (file.isDirectory) {
      const matchedFile = this.props.config.sourceFiles.find((sourceFile) =>
        sourceFile.route === file.route && !sourceFile.isDirectory
      );
      if (matchedFile) {
        file = matchedFile;
      }
    }

    const repo = file.repository ?? this.props.config.repository;

    return (
      <Fragment>
        {/* sidebar left */}
        <Sidebar
          position="left"
          width={this.#sideBarWidth}
          top={this.#headerHeight}
          contentWidth={this.#contentWidth}
        >
          <PageNavigation config={this.props.config} file={file} />
        </Sidebar>

        {/* main */}
        <div class={tw`lg:pl-[${this.#sideBarWidth}rem]`}>
          <div
            class={tw`max-w(3xl xl:none)
              mx-auto pt-10 xl:ml-0 xl:mr-[${this.#sideBarWidth}rem]`}
          >
            {/* content */}
            <main class={tw`${styles.transform.primary} relative`}>
              <Markdown file={file} sanitize={this.props.config.sanitize} />

              {repo
                ? (
                  <EditPageOnGithub
                    path={file.path}
                    repository={repo}
                    rev={this.props.config.rev}
                  />
                )
                : null}
            </main>

            {/* sidebar right */}
            <Sidebar
              position="right"
              width={this.#sideBarWidth}
              top={this.#headerHeight}
              contentWidth={this.#contentWidth}
            >
              <VersionSelection
                file={file}
                config={this.props.config}
              />
              <SecondaryPageNavigation file={file} />
            </Sidebar>
          </div>
        </div>
      </Fragment>
    );
  }
}

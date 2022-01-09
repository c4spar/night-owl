/** @jsx h */

import { EditPageOnGithub } from "../components/edit_page_on_github.tsx";
import { Markdown } from "../components/markdown.tsx";
import { Sidebar } from "../components/sidebar.tsx.tsx";
import { VersionSelection } from "../components/version_selection.tsx";
import { Component, Fragment, h, log, tw } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { transformGpu } from "../lib/styles.ts";
import { PageNavigation } from "../components/page_navigation.tsx";
import { SecondaryPageNavigation } from "../components/secondary_page_navigation.tsx";

export interface MarkdownPageOptions {
  config: AppConfig;
  file: SourceFile;
}

export class MarkdownPage extends Component<MarkdownPageOptions> {
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

    return (
      <Fragment>
        {/* sidebar left */}
        <Sidebar position="left" class={tw`${transformGpu} hidden lg:block`}>
          <PageNavigation config={this.props.config} file={file} />
        </Sidebar>

        {/* main */}
        <div class={tw`lg:pl-[19.5rem]`}>
          <div
            class={tw`max-w(3xl xl:none)
              mx-auto pt-10 xl:ml-0 xl:mr-[15.5rem] xl:pr-16`}
          >
            {/* content */}
            <main class={tw`${transformGpu} relative`}>
              <Markdown file={file} sanitize={this.props.config.sanitize} />

              <EditPageOnGithub
                path={file.path}
                repository={file.repository ??
                  this.props.config.repository}
                rev={this.props.config.rev}
              />
            </main>

            {/* sidebar right */}
            <Sidebar
              position="right"
              class={tw`${transformGpu} hidden xl:block`}
            >
              <VersionSelection
                class={tw`mb-3`}
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

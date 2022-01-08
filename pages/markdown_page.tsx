/** @jsx h */

import { EditPageOnGithub } from "../components/edit_page_on_github.tsx";
import { Markdown } from "../components/markdown.tsx";
import { ModuleSelection } from "../components/module_selection.tsx";
import { Sidebar } from "../components/sidebar.tsx.tsx";
import { VersionSelection } from "../components/version_selection.tsx";
import { Component, Fragment, h, log, tw } from "../deps.ts";
import { AppConfig } from "../lib/config.ts";
import { FileOptions } from "../lib/resource.ts";
import { transformGpu } from "../lib/styles.ts";
import { joinUrl } from "../lib/utils.ts";
import { PageNavigation } from "../components/page_navigation.tsx";
import { SecondaryPageNavigation } from "../components/secondary_page_navigation.tsx";

export interface MarkdownPageOptions {
  config: AppConfig;
  file: FileOptions;
}

export class MarkdownPage extends Component<MarkdownPageOptions> {
  render() {
    let file = this.props.file;
    if (file.isDirectory) {
      const matchedFile = this.props.config.sourceFiles.find((f) =>
        f.route === file.route && !f.isDirectory
      );
      if (matchedFile) {
        file = matchedFile;
      }
    }

    // @TODO: move to custom provider
    // Add selected version to cliffy module imports.
    if (this.props.file.rev) {
      file.content = file.content
        .replace(
          /https:\/\/deno\.land\/x\/cliffy\//g,
          `https://deno.land/x/cliffy@${this.props.file.rev}/`,
        )
        .replace(
          /https:\/\/deno\.land\/x\/cliffy@<version>\//g,
          `https://deno.land/x/cliffy@${this.props.file.rev}/`,
        )
        .replace(
          /https:\/\/x\.nest\.land\/cliffy@<version>\//g,
          `https://x.nest.land/cliffy@${this.props.file.rev}/`,
        )
        .replace(
          /https:\/\/raw\.githubusercontent\.com\/c4spar\/deno-cliffy\/<version>\//g,
          `https://raw.githubusercontent.com/c4spar/deno-cliffy/${this.props.file.rev}/`,
        );
    }

    return (
      <Fragment>
        {/* sidebar left */}
        <Sidebar position="left" class={tw`${transformGpu} hidden lg:block`}>
          <PageNavigation config={this.props.config} file={this.props.file} />
        </Sidebar>

        {/* main */}
        <div class={tw`lg:pl-[19.5rem]`}>
          <div
            class={tw`max-w(3xl xl:none)
              mx-auto pt-10 xl:ml-0 xl:mr-[15.5rem] xl:pr-16`}
          >
            {/* content */}
            <main class={tw`${transformGpu} relative`}>
              <Markdown file={file} />

              <EditPageOnGithub
                path={file.path}
                repository={this.props.config.repository}
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
                file={this.props.file}
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

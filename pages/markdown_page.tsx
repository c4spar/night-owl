/** @jsx h */

import { Footer } from "../components/footer.tsx";
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
    const index = this.props.config.sourceFiles.findIndex((sourceFile) =>
      sourceFile.route === this.props.file.route && !sourceFile.isDirectory
    );
    const file: SourceFile = this.props.config.sourceFiles[index];

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
              <Markdown
                file={file}
                files={this.props.config.sourceFiles}
                sanitize={this.props.config.sanitize}
              />
              <Footer file={file} config={this.props.config} />
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

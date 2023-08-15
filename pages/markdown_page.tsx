/** @jsx h */

import { Footer } from "../components/footer.tsx";
import { Markdown } from "../components/markdown.tsx";
import { Sidebar } from "../components/sidebar.tsx";
import { VersionDropdown } from "../components/version_dropdown.tsx";
import { Component, Fragment, h, Helmet, tw } from "../deps.ts";
import { AppConfig } from "../lib/config/config.ts";
import { SourceFile } from "../lib/resource/source_file.ts";
import { styles } from "../lib/styles.ts";
import { PageNavigation } from "../components/page_navigation.tsx";
import { SecondaryPageNavigation } from "../components/secondary_page_navigation.tsx";
import { RoundedIconButton } from "../components/buttons.tsx";

export interface MarkdownPageOptions {
  config: AppConfig;
  file: SourceFile;
  isBranch: boolean;
}

export class MarkdownPage extends Component<MarkdownPageOptions> {
  #sideBarWidth = 21;
  #contentWidth = 90;

  render() {
    const index = this.props.config.sourceFiles.findIndex((sourceFile) =>
      sourceFile.route === this.props.file.route && !sourceFile.isDirectory
    );
    const file: SourceFile = this.props.config.sourceFiles[index];

    return (
      <Fragment>
        <Helmet>
          <style>
            {`
            .fixed-sidebar {
              transform: translate(0, 0);
              position: fixed;
              left: 0;
              --owl-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              box-shadow: var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--owl-shadow);
            }
        `}
          </style>
        </Helmet>

        <Helmet footer>
          <script type="application/javascript">
            {this.#getScript()}
          </script>
        </Helmet>

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
              contentWidth={this.#contentWidth}
              isBranch={this.props.isBranch}
              class={tw`hidden xl:block`}
            >
              <VersionDropdown
                file={file}
                config={this.props.config}
              />
              <SecondaryPageNavigation file={file} />
            </Sidebar>
          </div>
        </div>

        <div
          class={`overlay ${tw`hidden left-0 top-0 right-0 bottom-0 fixed cursor-pointer ${styles.bg.primary} opacity-30`}`}
          onclick="toggleSideBar()"
        >
        </div>

        {/* sidebar left */}
        <Sidebar
          position="left"
          width={this.#sideBarWidth}
          contentWidth={this.#contentWidth}
          isBranch={this.props.isBranch}
          class={`sidebar ${tw`
            -translate-x-full lg:translate-x-0
            z-20 lg:z-0
            ${styles.transform.primary}`}`}
        >
          <PageNavigation config={this.props.config} file={file} />
        </Sidebar>

        <RoundedIconButton
          icon="ant-design:menu-outlined"
          class={tw`lg:hidden fixed right-5 bottom-5 z-20`}
          onclick="toggleSideBar()"
        />
      </Fragment>
    );
  }

  #getScript(): string {
    return `
      function toggleSideBar() {
        console.log("toggleSideBar");
        var sidebar = document.querySelector(".sidebar");
        var overlay = document.querySelector(".overlay");
        if (sidebar && overlay) {
          if (sidebar.classList.contains("fixed-sidebar")) {
            sidebar.classList.remove("fixed-sidebar");
            overlay.classList.add("hidden");
          } else {
            sidebar.classList.add("fixed-sidebar");
            overlay.classList.remove("hidden");
          }
        }
      }`;
  }
}

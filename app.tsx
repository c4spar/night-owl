/** @jsx h */

import { NotFound } from "./components/not_found.tsx";
import { PageBackground } from "./components/page_background.tsx";
import { AppConfig, Script } from "./lib/config.ts";
import { SourceFile } from "./lib/source_file.ts";
import { mainStyles, styles } from "./lib/styles.ts";
import { Header } from "./components/header.tsx";
import { Component, Fragment, h, Helmet, render, tw } from "./deps.ts";
import { MarkdownPage } from "./pages/markdown_page.tsx";
import { VersionWarning } from "./components/version_warning.tsx";

interface AppOptions {
  url: string;
  config: AppConfig;
  scripts: Record<string, Script>;
  file?: SourceFile;
}

export class App extends Component<AppOptions> {
  #file?: SourceFile;
  #isBranch = false;

  constructor(props: AppOptions) {
    super(props);
    if (
      this.props.file?.rev &&
      this.props.file.versions?.branches.includes(this.props.file.rev)
    ) {
      this.#isBranch = true;
    }
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          {Object.entries(this.props.scripts)
            .filter(([route, script]) => script.contentType === "text/css")
            .map(([route]) => (
              <link rel="stylesheet" type="text/css" href={route} />
            ))}

          {Object.entries(this.props.scripts)
            .filter(([route, script]) =>
              script.contentType === "application/javascript"
            )
            .map(([route]) => (
              <script type="application/javascript" src={route} defere />
            ))}
        </Helmet>

        <div class={tw`${mainStyles} mb-7 ${styles.font.primary}`}>
          <PageBackground>
            {render(this.props.config.background ?? null)}
          </PageBackground>

          {/* header */}
          <div class={tw`sticky top-0 z-10`}>
            <Header config={this.props.config} file={this.props.file} />
            {this.#isBranch
              ? (
                <VersionWarning
                  config={this.props.config}
                  file={this.props.file}
                />
              )
              : null}
          </div>

          {/* content */}
          <div class={tw`max-w-8xl mx-auto px-4 sm:px-6 md:px-8 relative`}>
            {this.#renderPage()}
          </div>
        </div>

        <Helmet footer>
          <script type="application/javascript">
            {`
              main();
  
              function main() {
                if (isDarkModeEnabled()) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }
  
              function isDarkModeEnabled() {
                return localStorage.theme === "dark" || (
                  !localStorage.theme &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                );
              }
            `}
          </script>
        </Helmet>
      </Fragment>
    );
  }

  #renderPage() {
    // Render page not found.
    if (!this.props.file) {
      return this.props.config.notFound
        ? this.props.config.notFound({ url: this.props.url })
        : <NotFound url={this.props.url} />;
    }

    // Render custom page component.
    if (this.props.file.component) {
      return this.props.file.component;
    }

    // Render markdown page.
    return (
      <MarkdownPage
        file={this.props.file}
        config={this.props.config}
        isBranch={this.#isBranch}
      />
    );
  }
}

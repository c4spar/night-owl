/** @jsx h */

import { NotFound } from "./components/not_found.tsx";
import { AppConfig } from "./lib/config.ts";
import { SourceFile } from "./lib/source_file.ts";
import { mainStyles } from "./lib/styles.ts";
import { Header } from "./components/header.tsx";
import { Component, h, Helmet, tw } from "./deps.ts";
import { MarkdownPage } from "./pages/markdown_page.tsx";

interface AppOptions {
  url: string;
  config: AppConfig;
}

export class App extends Component<AppOptions> {
  #file?: SourceFile;

  constructor(props: AppOptions) {
    super(props);

    const url = new URL(this.props.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    const files = this.props.config.sourceFiles.filter((file) =>
      file.route === pathname
    );

    this.#file = files.find((file) => !file.isDirectory) ?? files[0];
  }

  render() {
    return (
      <div class={tw`${mainStyles} mb-7`}>
        {this.props.config.background?.()}

        {/* header */}
        <div class={tw`sticky top-0 z-10`}>
          <Header config={this.props.config} file={this.#file} />
        </div>

        {/* content */}
        <div class={tw`max-w-8xl mx-auto px-4 sm:px-6 md:px-8 relative`}>
          {this.#renderPage()}
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
      </div>
    );
  }

  #renderPage() {
    // Render page not found.
    if (!this.#file) {
      return this.props.config.notFound
        ? this.props.config.notFound({ url: this.props.url })
        : <NotFound url={this.props.url} />;
    }

    // Render custom page component.
    if (this.#file.component) {
      return this.#file.component;
    }

    // Render markdown page.
    return <MarkdownPage file={this.#file} config={this.props.config} />;
  }
}

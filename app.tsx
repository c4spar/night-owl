/** @jsx h */

import { PageBackground } from "./components/page_background.tsx";
import { AppConfig } from "./lib/config.ts";
import { mainStyles } from "./lib/styles.ts";
import { Header } from "./components/header.tsx";
import { RouteNotFoundError } from "./components/router.tsx";
import { Component, h, Helmet, tw } from "./deps.ts";
import { MarkdownPage } from "./pages/markdown_page.tsx";

interface AppOptions {
  url: string;
  config: AppConfig;
}

export class App extends Component<AppOptions> {
  render() {
    return (
      <div class={tw`${mainStyles} mb-7`}>
        {/* background */}
        <PageBackground />

        {/* header */}
        <div class={tw`sticky top-0 z-10`}>
          <Header config={this.props.config} />
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
    const url = new URL(this.props.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    const files = this.props.config.sourceFiles.filter((file) =>
      file.route === pathname
    );
    const file = files.find((file) => !file.isDirectory) ?? files[0];

    if (!file) {
      throw new RouteNotFoundError(this.props.url);
    }

    if (file.component) {
      return file.component;
    }

    return <MarkdownPage file={file} config={this.props.config} />;
  }
}

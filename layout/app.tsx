/** @jsx h */

import { PageBackground } from "../components/page_background.tsx";
import { AppConfig } from "../lib/config.ts";
import { mainStyles } from "../lib/styles.ts";
import { DocsPage } from "../pages/docs.tsx";
import { Header } from "./header.tsx";
import { Router } from "../components/router.tsx";
import { Route } from "../components/route.tsx";
import { Component, h, Helmet, tw } from "../deps.ts";
import { BenchmarksPage } from "../pages/becnhmarks.tsx";
import { HomePage } from "../pages/home.tsx";

interface AppOptions {
  url: string;
  config: AppConfig;
}

export class App extends Component<AppOptions> {
  render() {
    const versions = this.props.config.versions.versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|");

    const docsPathRegex = new RegExp(`^/docs/?(${versions})?`);

    return (
      <div class={tw`${mainStyles} mb-7`}>
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

        {/* background */}
        <PageBackground />

        {/* header */}
        <div class={tw`sticky top-0 z-10`}>
          <Header />
        </div>

        {/* content */}
        <div class={tw`max-w-8xl mx-auto px-4 sm:px-6 md:px-8 relative`}>
          {/* main router */}
          <Router url={this.props.url}>
            <Route path="/">
              <HomePage examples={this.props.config.examples} />
            </Route>
            <Route path={docsPathRegex}>
              <DocsPage
                versions={this.props.config.versions}
                docs={this.props.config.docs}
                modules={this.props.config.modules}
                repository={this.props.config.repository}
              />
            </Route>
            <Route path="/benchmarks">
              <BenchmarksPage benchmarks={this.props.config.benchmarks} />
            </Route>
          </Router>
        </div>
      </div>
    );
  }
}

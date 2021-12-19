/** @jsx h */

import { PageBackground } from "../components/page_background.tsx";
import { Example, FileOptions } from "../lib/resource.ts";
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
  benchmarks: Array<FileOptions>;
  examples: Array<Example>;
  versions: Array<string>;
  docs: Array<FileOptions>;
}

export class App extends Component<AppOptions> {
  render() {
    return (
      <div class={tw`${mainStyles} mb-7`}>
        <Helmet footer>
          <script type="application/javascript" src="/main.js" />
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
              <HomePage examples={this.props.examples} />
            </Route>
            <Route path={/^\/docs\/?(v[0-9][^\/]*)?/}>
              <DocsPage versions={this.props.versions} docs={this.props.docs} />
            </Route>
            <Route path="/benchmarks">
              <BenchmarksPage data={this.props.benchmarks} />
            </Route>
          </Router>
        </div>
      </div>
    );
  }
}

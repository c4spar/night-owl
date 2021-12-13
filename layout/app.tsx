/** @jsx h */

import { Header } from "./header.tsx";
import { Router } from "../components/router.tsx";
import { Route } from "../components/route.tsx";
import { h, tw } from "../deps.ts";
import { Example, FileOptions } from "../lib/utils.ts";
import { BenchmarksPage } from "../pages/becnhmarks.tsx";
import { HomePage } from "../pages/home.tsx";

interface AppOptions {
  route: string;
  data: Array<FileOptions>;
  examples: Array<Example>;
}

export function App({ data, route, examples }: AppOptions) {
  return (
    <div
      class={tw`min-h-full overflow-hidden
        text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800`}
    >
      <div
        class={tw`fixed w-[200%] h-[200%]
          bg-black bg-opacity-5 dark:bg-opacity-10
          rotate-[19deg] -translate-y-[94%]`}
      />
      <div
        class={tw`fixed w-[200%] h-[200%]
          bg-black bg-opacity-5 dark:bg-opacity-10
          rotate-[19deg] -translate-x-[200%] md:-translate-x-[94%] -translate-y-[50%]`}
      />
      <div class={tw`relative`}>
        <Header />
        <main>
          <Router route={route}>
            <Route path="/">
              <HomePage examples={examples} />
            </Route>
            <Route path="/docs">
              <span>Documentation: Work in progress...</span>
            </Route>
            <Route path="/benchmarks">
              <BenchmarksPage data={data} />
            </Route>
          </Router>
        </main>
      </div>
    </div>
  );
}

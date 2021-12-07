/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Navigation } from "./components/navigation.tsx";
import { Router } from "./components/router.tsx";
import { Route } from "./components/route.tsx";
import { blue, Fragment, h, Helmet, renderSSR, serve } from "./deps.ts";
import { BenchmarksPage, ModuleData } from "./pages/becnhmarks.tsx";
import { Index } from "./pages/index.ts";

interface AppOptions {
  route: string;
  benchmarks: Array<ModuleData>;
}

function App({ benchmarks, route }: AppOptions) {
  return (
    <Fragment>
      <header>
        <Navigation />
      </header>
      <section class="container mx-auto p-5">
        <Router route={route}>
          <Route path="/">
            <span>Home: Work in progress...</span>
          </Route>
          <Route path="/manual">
            <span>Manual: Work in progress...</span>
          </Route>
          <Route path="/benchmarks">
            <BenchmarksPage benchmarks={benchmarks} />
          </Route>
        </Router>
      </section>
    </Fragment>
  );
}

const benchmarks: Array<ModuleData> = JSON.parse(
  await Deno.readTextFile("./data/benchmarks.json"),
);

console.log(`Listening on ${blue("http://localhost:8000")}`);

await serve((request) => {
  const route = new URL(request.url).pathname;
  const html = renderSSR(<App benchmarks={benchmarks} route={route} />);
  const { body, head, footer } = Helmet.SSR(html);

  return new Response(
    Index({ body, head, footer }),
    { headers: { "content-type": "text/html" } },
  );
});

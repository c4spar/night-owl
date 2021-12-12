/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Header } from "./components/header.tsx";
import { Router } from "./components/router.tsx";
import { Route } from "./components/route.tsx";
import { blue, getStyleTag, h, Helmet, renderSSR, serve, tw } from "./deps.ts";
import { sheet } from "./lib/sheet.ts";
import { Example, FileOptions, getExamples, readDir } from "./lib/utils.ts";
import { BenchmarksPage } from "./pages/becnhmarks.tsx";
import { HomePage } from "./pages/home.tsx";
import { Index } from "./pages/index.ts";

interface AppOptions {
  route: string;
  data: Array<FileOptions>;
  examples: Array<Example>;
}

function App({ data, route, examples }: AppOptions) {
  return (
    <div class={tw`min-h-full`}>
      <Header />
      <main class={tw`container mx-auto p-4`}>
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
  );
}

const examples: Array<Example> = await getExamples();
const data: Array<FileOptions> = await readDir("data");

console.log(`Listening on ${blue("http://localhost:8000")}`);

await serve(async (req) => {
  sheet.reset();

  const route = new URL(req.url).pathname;
  console.log(blue(`[${req.method}]`), req.url);

  switch (route) {
    case "/styles.css":
      return new Response(
        await Deno.readTextFile("styles.css"),
        { headers: { "content-type": "text/css" } },
      );

    default: {
      const app = renderSSR(
        <App route={route} examples={examples} data={data} />,
      );
      const { body, head, footer } = Helmet.SSR(app);
      const styles = getStyleTag(sheet);
      const html = Index({ body, head, footer, styles });

      return new Response(
        html,
        { headers: { "content-type": "text/html" } },
      );
    }
  }
});

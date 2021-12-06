/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, Helmet, renderSSR, serve } from "./deps.ts";
import {
  BenchmarksPage,
  ModuleData,
} from "./pages/benchmarks/becnhmarks_page.tsx";
import { Index } from "./pages/index.ts";

function App({ benchmarks }: { benchmarks: Array<ModuleData> }) {
  return <BenchmarksPage benchmarks={benchmarks} />;
}

const benchmarks: Array<ModuleData> = JSON.parse(
  await Deno.readTextFile("./bench.json"),
);

console.log("Listening on http://localhost:8000");
await serve(() => {
  const html = renderSSR(<App benchmarks={benchmarks} />);
  const { body, head, footer } = Helmet.SSR(html);

  return new Response(
    Index({ body, head, footer }),
    { headers: { "content-type": "text/html" } },
  );
});

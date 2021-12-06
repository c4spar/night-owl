/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, serve } from "./deps.ts";
import {
  BenchmarksPage,
  ModuleData,
} from "./pages/benchmarks/becnhmarks_page.tsx";
import { ssr } from "./ssr.tsx";

function App({ benchmarks }: { benchmarks: Array<ModuleData> }) {
  return <BenchmarksPage benchmarks={benchmarks} />;
}

const benchmarks: Array<ModuleData> = JSON.parse(
  await Deno.readTextFile("./bench.json"),
);

console.log("Listening on http://localhost:8000");
await serve(() => ssr(() => <App benchmarks={benchmarks} />));

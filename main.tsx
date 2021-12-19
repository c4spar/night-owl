/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, serve } from "./deps.ts";
import { fromLocalCache, fromRemoteCache, fromSsrCache } from "./lib/request.ts";
import { getVersions } from "./lib/git.ts";
import {
  Example,
  FileOptions,
  getBenchmarks,
  getDocs,
  getExamples,
} from "./lib/resource.ts";
import { App } from "./layout/app.tsx";

const versions = await getVersions();

const [examples, benchmarks, docs]: [
  Array<Example>,
  Array<FileOptions>,
  Array<FileOptions>,
] = await Promise.all([
  getExamples(),
  getBenchmarks(),
  getDocs(),
]);

console.log(`Listening on ${blue("http://localhost:8000")}`);

await serve((req) => {
  console.log(blue(`[${req.method}]`), req.url);

  if (req.method !== "GET") {
    return new Response("Bad Request", { status: 400 });
  }

  switch (new URL(req.url).pathname) {
    case "/main.js":
      return fromLocalCache("client/main.js", "application/javascript");

    case "/iconify.min.js":
      return fromRemoteCache(
        "https://code.iconify.design/2/2.1.0/iconify.min.js",
        "application/javascript",
        req,
      );

    case "/highlight.min.js":
      return fromRemoteCache(
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js",
        "application/javascript",
        req,
      );

    default:
      return fromSsrCache(
        <App
          url={req.url}
          examples={examples}
          benchmarks={benchmarks}
          versions={versions}
          docs={docs}
        />,
        "text/html",
        req,
      );
  }
});

/** @jsx h */

/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, serve as serveHttp } from "../deps.ts";
import { Config, ConfigOptions, initConfig } from "./config.ts";
import { fromLocalCache, fromRemoteCache, fromSsrCache } from "./request.ts";
import { getResources, Resources } from "./resource.ts";
import { App } from "../layout/app.tsx";

export async function serve(options: ConfigOptions) {
  initConfig(options);
  const {
    versions,
    examples,
    benchmarks,
    docs,
    modules,
  }: Resources = await getResources();

  if (!Config.modules.length) {
    initConfig({ modules });
  }

  console.log(`Listening on ${blue("http://localhost:8000")}`);

  await serveHttp((req) => {
    console.log(blue(`[${req.method}]`), req.url);

    if (req.method !== "GET") {
      return new Response("Bad Request", { status: 400 });
    }

    switch (new URL(req.url).pathname) {
      // case "/an-old-hope.min.css":
      //   return fromRemoteCache(
      //     "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/an-old-hope.min.css",
      //     "text/css",
      //     req,
      //   );
      //
      // case "/google/fonts.css":
      //   return fromRemoteCache(
      //     "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Titan+One&family=Varela+Round&display=swap",
      //     "text/css",
      //     req,
      //   );
      //
      // case "/firacode-nerd-font.css":
      //   return fromRemoteCache(
      //     "https://mshaugh.github.io/nerdfont-webfonts/build/firacode-nerd-font.css",
      //     "text/css",
      //     req,
      //   );
      //
      // case "/styles.css":
      //   return fromLocalCache("client/styles.css", "text/css");

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
}

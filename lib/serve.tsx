/** @jsx h */

/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, log, serve as serveHttp } from "../deps.ts";
import { Cache } from "./cache.ts";
import { CreateConfigOptions, createConfig } from "./config.ts";
import { fromRemoteCache } from "./request.ts";
import { App } from "../app.tsx";
import { ssr } from "./ssr.ts";

export async function serve(options: CreateConfigOptions) {
  console.log(`Listening on ${blue("http://localhost:8000")}`);

  const cache = new Cache<string>();

  await serveHttp(async (req) => {
    log.info(blue(`[${req.method}]`), req.url);

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

      default: {
        let html: string | undefined = cache.get(req.url);
        if (!html) {
          const config = await createConfig(options, req);
          html = ssr(<App url={req.url} config={config} />);
        }

        return new Response(html, { headers: { "content-type": "text/html" } });
      }
    }
  });
}

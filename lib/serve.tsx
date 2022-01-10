/** @jsx h */

/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, log, serve as serveHttp } from "../deps.ts";
import { Cache } from "./cache.ts";
import { createConfig, CreateConfigOptions } from "./config.ts";
import { App } from "../app.tsx";
import { fromRemoteCache, Script } from "./request.ts";
import { ssr } from "./ssr.ts";

export async function serve<O>(options: CreateConfigOptions<O>) {
  console.log(`Listening on ${blue("http://localhost:8000")}`);

  const cache = new Cache<string>();

  const scripts: Record<string, Script> = {
    "/font-awesome.css": {
      url: "https://use.fontawesome.com/releases/v5.0.1/css/all.css",
      contentType: "text/css",
    },
    "/google-fonts.css": {
      url: "https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap",
      contentType: "text/css",
    },
    "/firacode-nerd-font.css": {
      url:
        "https://mshaugh.github.io/nerdfont-webfonts/build/firacode-nerd-font.css",
      contentType: "text/css",
    },
    "/iconify.min.js": {
      url: "https://code.iconify.design/2/2.1.0/iconify.min.js",
      contentType: "application/javascript",
    },
    "/webfonts/fa-solid-900.woff2": {
      url:
        "https://use.fontawesome.com/releases/v5.0.1/webfonts/fa-solid-900.woff2",
      contentType: "application/x-font-woff2",
    },
  };

  await serveHttp(async (req) => {
    log.info(blue(`[${req.method}]`), req.url);

    if (req.method !== "GET") {
      return new Response("Bad Request", { status: 400 });
    }
    const { pathname } = new URL(req.url);

    if (scripts[pathname]) {
      return fromRemoteCache(
        scripts[pathname].url,
        scripts[pathname].contentType,
        req,
      );
    }

    let html: string | undefined = cache.get(req.url);
    if (!html) {
      const config = await createConfig(options, req);
      html = ssr(
        <App url={req.url} config={config} scripts={scripts} />,
      );
    }

    return new Response(html, { headers: { "content-type": "text/html" } });
  });
}

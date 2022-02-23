/** @jsx h */

/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, log, serve as serveHttp } from "../deps.ts";
import { Cache } from "./cache.ts";
import { createConfig, CreateConfigOptions, Script } from "./config.ts";
import { App } from "../app.tsx";
import { fromLocalCache, fromRemoteCache } from "./request.ts";
import { setupTwind } from "./sheet.ts";
import { ssr } from "./ssr.ts";

export interface ServeOptions<O> extends CreateConfigOptions<O> {
  port?: number;
  hostname?: string;
}

export async function serve<O>(
  { port = 8000, hostname, ...options }: ServeOptions<O>,
) {
  console.log(`Listening on ${blue(`http://localhost:${port}`)}`);

  const cache = new Cache<string>();

  const scripts: Record<string, Script> = {
    "/font-awesome.css": {
      url: "https://use.fontawesome.com/releases/v5.0.1/css/all.css",
      contentType: "text/css",
    },
    "/webfonts/fa-solid-900.woff2": {
      url:
        "https://use.fontawesome.com/releases/v5.0.1/webfonts/fa-solid-900.woff2",
      contentType: "font/woff2",
    },
    "/firacode-nerd-font.css": {
      url:
        "https://mshaugh.github.io/nerdfont-webfonts/build/firacode-nerd-font.css",
      contentType: "text/css",
    },
    "/fonts/Fira%20Code%20Bold%20Nerd%20Font%20Complete.woff2": {
      url:
        "https://mshaugh.github.io/nerdfont-webfonts/build/fonts/Fira%20Code%20Bold%20Nerd%20Font%20Complete.woff2",
      contentType: "font/woff2",
    },
    "/fonts/Fira%20Code%20Bold%20Nerd%20Font%20Complete.ttf": {
      url:
        "https://mshaugh.github.io/nerdfont-webfonts/build/fonts/Fira%20Code%20Bold%20Nerd%20Font%20Complete.ttf",
      contentType: "font/ttf",
    },
    "/iconify.js": {
      url: "https://code.iconify.design/2/2.1.0/iconify.min.js",
      contentType: "application/javascript",
    },
    ...options.scripts ?? {},
  };

  setupTwind(options.theme);

  await serveHttp(async (req) => {
    log.info(blue(`[${req.method}]`), req.url);

    if (req.method !== "GET") {
      return new Response("Bad Request", { status: 400 });
    }
    const { pathname } = new URL(req.url);

    if (scripts[pathname]) {
      return scripts[pathname].url.startsWith("http://") ||
          scripts[pathname].url.startsWith("https://")
        ? fromRemoteCache(
          scripts[pathname].url,
          scripts[pathname].contentType,
          req,
        )
        : fromLocalCache(
          scripts[pathname].url,
          scripts[pathname].contentType,
        );
    }

    let html: string | undefined = cache.get(req.url);
    if (!html) {
      const config = await createConfig(options, req);
      html = ssr(
        <App url={req.url} config={config} scripts={scripts} />,
      );
      cache.set(req.url, html);
    }

    return new Response(html, { headers: { "content-type": "text/html" } });
  }, {
    port,
    hostname,
  });
}

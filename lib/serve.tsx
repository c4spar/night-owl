/** @jsx h */

/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, h, log, lookup, serve as serveHttp } from "../deps.ts";
import { Cache } from "./cache.ts";
import { createConfig, CreateConfigOptions, Script } from "./config.ts";
import { App } from "../app.tsx";
import {
  respondBadRequest,
  respondInternalServerEror,
  respondLocalFile,
  respondNoContent,
  respondNotFound,
  respondRemoteFile,
} from "./request.ts";
import { setupTwind } from "./sheet.ts";
import { ssr } from "./ssr.ts";
import { gitCache } from "./git.ts";
import { matchFile } from "./utils.ts";

export interface ServeOptions<O> extends CreateConfigOptions<O> {
  port?: number;
  hostname?: string;
  assets?: Array<string>;
  webhooks?: boolean;
}

export async function serve<O>({
  port = 8000,
  hostname,
  assets,
  webhooks = true,
  ...options
}: ServeOptions<O>) {
  log.info("Listening on http://localhost:%s", port);

  const cache = new Cache<string>();

  const scripts: Record<string, Script> = {
    ...getScripts(),
    ...options.scripts ?? {},
  };

  setupTwind(options.theme);

  await serveHttp(async (req) => {
    log.info(blue(`[${req.method}]`), req.url);

    if (req.method !== "GET") {
      return respondBadRequest();
    }
    const { pathname } = new URL(req.url);

    if (scripts[pathname]) {
      return respondScript(scripts[pathname], req);
    }

    if (pathname === "/favicon.ico") {
      return respondNotFound();
    }

    const isAssetRequest = assets?.find((path) =>
      pathname.startsWith("/" + path)
    );
    if (isAssetRequest) {
      return respondAsset(pathname);
    }

    if (webhooks && pathname === "/webhooks/cache/clear") {
      cache.clear();
      gitCache.clear();
      return respondNoContent();
    }

    return await respondPage<O>(options, scripts, req, cache);
  }, {
    port,
    hostname,
  });
}

async function respondPage<O>(
  options: CreateConfigOptions<O>,
  scripts: Record<string, Script>,
  req: Request,
  cache: Cache<string>,
) {
  let html: string | undefined = cache.get(req.url);
  if (!html) {
    const config = await createConfig(options, req);
    const file = matchFile(config.sourceFiles, req.url);

    // Redirect to the latest version.
    if (file?.rev && !file.route.includes(file.rev)) {
      return Response.redirect(new URL(file.latestRoute, req.url));
    }

    html = ssr(
      <App url={req.url} config={config} file={file} scripts={scripts} />,
    );
    cache.set(req.url, html);
  }

  return new Response(html, { headers: { "content-type": "text/html" } });
}

async function respondAsset(pathname: string) {
  try {
    return await respondLocalFile(
      `.${pathname}`,
      lookup(pathname) ?? "text/plain",
    );
  } catch (error: unknown) {
    if (error instanceof Deno.errors.NotFound) {
      return respondNotFound();
    }
    return respondInternalServerEror();
  }
}

function respondScript(script: Script, req: Request) {
  return script.url.startsWith("http://") ||
      script.url.startsWith("https://")
    ? respondRemoteFile(
      script.url,
      script.contentType,
      req,
    )
    : respondLocalFile(
      script.url,
      script.contentType,
    );
}

function getScripts(): Record<string, Script> {
  return {
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
    "/algolia-dsn.js": {
      url: "https://YOUR_APP_ID-dsn.algolia.net",
      contentType: "application/javascript",
    },
    "/docsearch.js": {
      url: "https://cdn.jsdelivr.net/npm/@docsearch/js@3",
      contentType: "application/javascript",
    },
    "/docsearch.css": {
      url: "https://cdn.jsdelivr.net/npm/@docsearch/css@3",
      contentType: "text/css",
    },
  };
}

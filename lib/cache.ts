import { getStyleTag, Helmet, renderSSR } from "../deps.ts";
import { Document } from "../layout/document.ts";
import { sheet } from "./sheet.ts";

const cache: Record<string, string> = {};

export async function fromLocalCache(
  path: string,
  contentType: string,
): Promise<Response> {
  return new Response(await getLocalFile(path), {
    headers: { "content-type": contentType },
  });
}

export async function fromRemoteCache(
  url: string,
  contentType: string,
  req: Request,
): Promise<Response> {
  return new Response(await getRemoteFile(url, req), {
    headers: { "content-type": contentType },
  });
}

export function fromSsrCache(route: string, app: unknown): Response {
  return new Response(
    getSsr(route, app),
    { headers: { "content-type": "text/html" } },
  );
}

async function getLocalFile(path: string): Promise<string> {
  if (!cache[path]) {
    cache[path] = await Deno.readTextFile(path);
  }
  return cache[path];
}

async function getRemoteFile(
  url: string,
  req: Request,
): Promise<string> {
  if (!cache[url]) {
    cache[url] = await fetch(url, {
      headers: req.headers,
      method: req.method,
      body: req.body,
    }).then((resp) => resp.text());
  }
  return cache[url];
}

function getSsr(route: string, app: unknown): string {
  if (!cache[route]) {
    sheet.reset();
    const html = renderSSR(app);
    const { body, head, footer } = Helmet.SSR(html);
    const styles = getStyleTag(sheet);
    cache[route] = Document({ body, head, footer, styles });
  }
  return cache[route];
}

import { getStyleTag, Helmet, renderSSR } from "../deps.ts";
import { Document } from "../layout/document.ts";
import { Cache } from "./cache.ts";
import { sheet } from "./sheet.ts";

const cache: Cache<string> = new Cache();

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

export function fromSsrCache(
  app: unknown,
  contentType: string,
  req: Request,
): Response {
  return new Response(
    getSsr(app, req),
    { headers: { "content-type": contentType } },
  );
}

async function getLocalFile(path: string): Promise<string> {
  let content = cache.get(path);
  if (!content) {
    content = await Deno.readTextFile(path);
    cache.set(path, content);
  }
  return content;
}

async function getRemoteFile(
  url: string,
  req: Request,
): Promise<string> {
  let content = cache.get(req.url);
  if (!content) {
    const response = await fetch(url, {
      headers: req.headers,
      method: req.method,
      body: req.body,
    });
    content = await response.text();
    cache.set(url, content);
  }
  return content;
}

function getSsr(app: unknown, req: Request): string {
  let content = cache.get(req.url);
  if (!content) {
    sheet.reset();
    const html = renderSSR(app);
    const { body, head, footer } = Helmet.SSR(html);
    const styles = getStyleTag(sheet);
    content = Document({ body, head, footer, styles });
    cache.set(req.url, content);
  }
  return content;
}

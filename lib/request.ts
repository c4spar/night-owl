import { Cache } from "./cache.ts";

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

async function getLocalFile(path: string): Promise<string> {
  let content = cache.get(path);
  if (content) {
    return content;
  }
  content = await Deno.readTextFile(path);
  cache.set(path, content);
  return content;
}

async function getRemoteFile(
  url: string,
  req: Request,
): Promise<string> {
  let content = cache.get(url);
  if (content) {
    return content;
  }
  const response = await fetch(url, {
    headers: req.headers,
    method: req.method,
    body: req.body,
  });
  content = await response.text();
  cache.set(url, content);
  return content;
}

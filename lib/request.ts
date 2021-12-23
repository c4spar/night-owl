import { Cache } from "./cache.ts";

const remoteCache: Cache<ArrayBuffer> = new Cache();
const localCache: Cache<Uint8Array> = new Cache();

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

export async function getLocalFile(path: string): Promise<Uint8Array> {
  let content = localCache.get(path);
  if (content) {
    return content;
  }
  content = await Deno.readFile(path);
  localCache.set(path, content);
  return content;
}

async function getRemoteFile(
  url: string,
  req: Request,
): Promise<ArrayBuffer> {
  let content = remoteCache.get(url);
  if (content) {
    return content;
  }
  const response = await fetch(url, {
    headers: req.headers,
    method: req.method,
    body: req.body,
  });
  content = await response.arrayBuffer();
  remoteCache.set(url, content);
  return content;
}

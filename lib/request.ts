import { Cache } from "./cache.ts";

const remoteCache: Cache<Promise<ArrayBuffer>> = new Cache();
const localCache: Cache<Promise<Uint8Array>> = new Cache();

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

export function getLocalFile(path: string): Promise<Uint8Array> {
  let response = localCache.get(path);
  if (response) {
    return response;
  }
  response = Deno.readFile(path);
  localCache.set(path, response);
  return response;
}

export function getRemoteFile(
  url: string,
  req?: Request,
): Promise<ArrayBuffer> {
  let response = remoteCache.get(url);
  if (response) {
    return response;
  }
  response = fetch(
    url,
    req
      ? {
        headers: req.headers,
        method: req.method,
        body: req.body,
      }
      : undefined,
  ).then((response) => response.arrayBuffer());
  // } : undefined).then(response => response.text());
  remoteCache.set(url, response);
  return response;
}

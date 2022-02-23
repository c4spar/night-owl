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
  return Deno.readFile(path);
}

export function getRemoteFile(
  url: string,
  req?: Request,
): Promise<ArrayBuffer> {
  return fetch(
    url,
    req
      ? {
        headers: req.headers,
        method: req.method,
        body: req.body,
      }
      : undefined,
  ).then((response) => response.arrayBuffer());
}

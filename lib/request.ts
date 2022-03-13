export async function respondLocalFile(
  path: string,
  contentType: string,
): Promise<Response> {
  return new Response((await Deno.open(path)).readable, {
    headers: { "content-type": contentType },
  });
}

export async function respondRemoteFile(
  url: string,
  contentType: string,
  req: Request,
): Promise<Response> {
  return new Response(await getRemoteFile(url, req), {
    headers: { "content-type": contentType },
  });
}

export function getRemoteFile(
  url: string,
  req?: Request,
): Promise<ReadableStream<Uint8Array> | null> {
  return fetch(
    url,
    req
      ? {
        headers: req.headers,
        method: req.method,
        body: req.body,
      }
      : undefined,
  ).then((response) => response.body);
}

export function respondNoContent(): Response {
  return new Response(null, { status: 204 });
}

export function respondNotFound(): Response {
  return new Response("Not found", { status: 404 });
}

export function respondBadRequest(): Response {
  return new Response("Bad request", { status: 400 });
}

export function respondInternalServerEror(): Response {
  return new Response("Internal server error", { status: 500 });
}

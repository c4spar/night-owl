/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Helmet, renderSSR } from "./deps.ts";

interface AppOptions {
  body: string;
  head: Array<string>;
  footer: Array<string>;
}

function Html({ body, head, footer }: AppOptions) {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" />
        ${head.join("\n")}
      </head>
      <body class="bg-gray-800">
        <header class="text-gray-300 body-font">
          <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a class="flex title-font font-medium items-center text-gray-300 mb-4 md:mb-0">
              <span class="ml-3 text-xl">Cliffy</span>
            </a>
            <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
              <a class="mr-5 hover:text-gray-200" href="https://doc.deno.land/https://deno.land/x/cliffy/mod.ts" target="_blank" >API</a>
              <a class="mr-5 text-gray-500">Manual</a>
              <a class="mr-5 hover:text-gray-200" href="">Benchmarks</a>
              <a class="mr-5 hover:text-gray-200" href="https://github.com/c4spar/deno-cliffy" target="_blank">Github</a>
            </nav>
          </div>
        </header>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `);
}

export function ssr(app: CallableFunction) {
  const html = renderSSR(app);
  const { body, head, footer } = Helmet.SSR(html);

  return new Response(
    Html({ body, head, footer }),
    { headers: { "content-type": "text/html" } },
  );
}

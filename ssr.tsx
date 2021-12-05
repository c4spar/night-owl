/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {
  getStyleTag,
  Helmet,
  renderSSR,
  setup,
  typography,
  virtualSheet,
} from "./deps.ts";

const sheet: any = virtualSheet();
setup({ sheet, plugins: { ...typography() } });

interface AppOptions {
  body: string;
  head: Array<string>;
  footer: Array<string>;
  styleTag: string;
}

function Html({ body, head, footer, styleTag }: AppOptions) {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello from JSX</title>
        ${head.join("\n")}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `);
}

export function ssr(app: CallableFunction) {
  sheet.reset();

  const styleTag = getStyleTag(sheet);
  const html = renderSSR(app);
  const { body, head, footer } = Helmet.SSR(html);

  return new Response(
    Html({ body, head, footer, styleTag }),
    { headers: { "content-type": "text/html" } },
  );
}

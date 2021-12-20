import { getStyleTag } from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind/sheets.js";
import { Helmet } from "https://deno.land/x/nano_jsx@v0.0.26/components/helmet.ts";
import { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.26/ssr.ts";
import { sheet } from "./sheet.ts";

interface DocumentOptions {
  body: string;
  head: Array<string>;
  footer: Array<string>;
  styles: string;
}

function Document({ body, head, footer, styles }: DocumentOptions) {
  return (`
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${styles}
        ${head.join("\n")}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `);
}

export function ssr(app: unknown): string {
  sheet.reset();
  const html = renderSSR(app);
  const { body, head, footer } = Helmet.SSR(html);
  const styles = getStyleTag(sheet);
  return Document({ body, head, footer, styles });
}

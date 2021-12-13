/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { blue, getStyleTag, h, Helmet, renderSSR, serve, tw } from "./deps.ts";
import { sheet } from "./lib/sheet.ts";
import { Example, FileOptions, getExamples, readDir } from "./lib/utils.ts";
import { App } from "./layout/app.tsx";
import { Document } from "./layout/document.ts";

const examples: Array<Example> = await getExamples();
const data: Array<FileOptions> = await readDir("data");

console.log(`Listening on ${blue("http://localhost:8000")}`);

await serve(async (req) => {
  sheet.reset();

  const route = new URL(req.url).pathname;
  console.log(blue(`[${req.method}]`), req.url);

  switch (route) {
    case "/styles.css":
      return new Response(
        await Deno.readTextFile("styles.css"),
        { headers: { "content-type": "text/css" } },
      );

    default: {
      const app = renderSSR(
        <App route={route} examples={examples} data={data} />,
      );
      const { body, head, footer } = Helmet.SSR(app);
      const styles = getStyleTag(sheet);
      const html = Document({ body, head, footer, styles });

      return new Response(
        html,
        { headers: { "content-type": "text/html" } },
      );
    }
  }
});

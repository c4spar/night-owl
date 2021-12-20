import { getStyleTag } from "https://cdn.skypack.dev/-/twind@v0.16.16-LPGqCzM3XVHFUO0IDjyk/dist=es2020,mode=imports/optimized/twind/sheets.js";
import { Helmet } from "https://deno.land/x/nano_jsx@v0.0.26/components/helmet.ts";
import { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.26/ssr.ts";
import { Document } from "../layout/document.ts";
import { sheet } from "./sheet.ts";

export function ssr(app: unknown): string {
  sheet.reset();
  const html = renderSSR(app);
  const { body, head, footer } = Helmet.SSR(html);
  const styles = getStyleTag(sheet);
  return Document({ body, head, footer, styles });
}

import { decoder } from "../../encode.ts";
import { encodeBase64, typeByExtension } from "../../../deps.ts";

export interface DenoReadFileOptions {
  base64?: boolean;
}

export async function denoReadFile(
  path: string,
  opts: DenoReadFileOptions,
): Promise<string> {
  const file = await Deno.readFile(path);
  if (opts.base64) {
    try {
      return `data:${typeByExtension(path)};charset=utf-8;base64,${
        encodeBase64(file)
      }`;
    } catch (error: unknown) {
      throw new Error("Failed to encode base64 string: " + path, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  return decoder.decode(file);
}

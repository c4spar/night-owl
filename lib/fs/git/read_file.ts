import { decodeBase64, typeByExtension } from "../../../deps.ts";
import { decoder } from "../../encode.ts";
import { gitFetch } from "./git_fetch.ts";

export type GitReadFileOptions = {
  repository: string;
  rev: string;
  base64?: boolean;
};

export async function gitReadFile(
  path: string,
  opts: GitReadFileOptions,
): Promise<string> {
  path = path.replace(/^\//, "")
    .replace(/\/$/, "");

  const file = await gitFetch<{ content: string }>(
    opts.repository,
    `contents/${path}${opts.rev ? `?ref=${opts.rev}` : ""}`,
  );

  try {
    return opts.base64
      ? `data:${typeByExtension(path)};charset=utf-8;base64,${file.content}`
      : decoder.decode(decodeBase64(file.content));
  } catch (error: unknown) {
    throw new Error("Failed to decode base64 string: " + file.content, {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

import { basename, dirname } from "https://deno.land/std@0.119.0/path/mod.ts";
import { lookup } from "https://deno.land/x/media_types@v2.11.1/mod.ts";
import { encodeBase64 } from "../deps.ts";
import { gitReadFile } from "./git.ts";

export interface AssetOptions {
  addVersion?: boolean;
  base64?: true;
  basePath: string;
  read?: boolean;
  repository?: string;
  rev?: string;
}

const decoder = new TextDecoder("utf8");

export class Asset {
  #basePath: string;
  #content: string;
  #dirName: string;
  #fileName: string;
  #path: string;
  #repository?: string;
  #rev?: string;

  static async create(path: string, opts: AssetOptions): Promise<Asset> {
    const content = opts.read ? await readTextFile(path, opts) : "";

    return new this(path, content, opts);
  }

  protected constructor(path: string, content: string, opts: AssetOptions) {
    this.#path = path;
    this.#content = content;
    this.#fileName = basename(path);
    this.#dirName = dirname(path);

    this.#basePath = opts.basePath;
    this.#rev = opts.rev;
    this.#repository = opts.repository;
  }

  get basePath() {
    return this.#basePath;
  }

  get path() {
    return this.#path;
  }

  get dirName() {
    return this.#dirName;
  }

  get fileName() {
    return this.#fileName;
  }

  get content() {
    return this.#content;
  }

  get rev() {
    return this.#rev;
  }

  get repository() {
    return this.#repository;
  }

  toJson(compact = true) {
    return {
      ...{
        basePath: this.#basePath,
        path: this.#path,
        dirName: this.#dirName,
        fileName: this.#fileName,
        rev: this.#rev,
        repository: this.#repository,
      },
      ...compact ? {} : { content: this.#content },
    };
  }
}

export async function readTextFile(path: string, opts: AssetOptions) {
  try {
    return opts.repository
      ? await gitReadFile(opts.repository, opts.rev!, path, opts.base64)
      : await denoReadFile(path, opts.base64);
  } catch (error: unknown) {
    throw new Error("Failed to read file: " + path, {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

async function denoReadFile(path: string, base64?: boolean): Promise<string> {
  const file = await Deno.readFile(path);
  if (base64) {
    try {
      return `data:${lookup(path)};charset=utf-8;base64,${encodeBase64(file)}`;
    } catch (error: unknown) {
      throw new Error("Failed to encode base64 string: " + path, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  return decoder.decode(file);
}

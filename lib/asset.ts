import { basename, dirname } from "../deps.ts";
import { readTextFile, ReadTextFileOptions } from "./fs/read_text_file.ts";

export type AssetOptions = ReadTextFileOptions & {
  addVersion?: boolean;
  basePath: string;
  read?: boolean;
};

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
    if ("rev" in opts) {
      this.#rev = opts.rev;
    }
    if ("repository" in opts) {
      this.#repository = opts.repository;
    }
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

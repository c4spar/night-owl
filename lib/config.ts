import { NavItemOptions } from "../components/header.tsx";
import { NotFoundOptions } from "../components/not_found.tsx";
import { bold, log } from "../deps.ts";
import { ProviderOptions } from "./provider.ts";
import { FileOptions, getFiles } from "./resource.ts";

export interface NavOptions {
  collapse?: boolean;
  items?: Array<NavItemOptions>;
}

export interface CreateConfigOptions<O> {
  repository: string;
  src?: string | Array<string>;
  rev?: string;
  label?: unknown;
  pagesDropdown?: boolean;
  versions?: Array<string>;
  pages?: boolean;
  nav?: NavOptions;
  notFound?: (props: NotFoundOptions) => unknown;
  background?: () => unknown;
  providers?: Array<ProviderOptions<O>>;
}

export interface AppConfig
  extends Omit<CreateConfigOptions<unknown>, "versions"> {
  src: string | Array<string>;
  rev: string;
  label: unknown;
  sourceFiles: Array<FileOptions>;
}

export async function createConfig<O>(
  options: CreateConfigOptions<O>,
  req: Request,
): Promise<AppConfig> {
  const opts = {
    src: "./",
    rev: "main",
    label: "Nano Deploy",
    ...options,
  };

  const now = Date.now();
  log.info(bold("Fetching resources..."));

  const src = typeof opts.src === "string" ? [opts.src] : opts.src;

  const sourceFiles = await Promise.all(src.map((path) =>
    getFiles(path, {
      recursive: true,
      includeDirs: true,
      loadAssets: true,
      pattern: /\.(md|js|jsx|ts|tsx)$/,
      read: true,
      repository: opts.repository,
      req,
      pages: opts.pages,
      providers: opts.providers,
    })
  )).then((files) => files.flat());

  log.info(
    bold("%s Resources fetched in: %s"),
    sourceFiles.length,
    (Date.now() - now).toString() + "ms",
  );

  return {
    ...opts,
    sourceFiles,
  };
}

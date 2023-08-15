import { basename, dirname, log, parseYaml } from "../../deps.ts";
import { CreateConfigOptions, Toc, TocTree } from "../config/config.ts";
import { pathToUrl } from "../utils.ts";
import { FileOptions, readSourceFiles } from "./read_source_files.ts";

export async function readTocFile<T>(
  fileOptions: FileOptions,
  opts: CreateConfigOptions<T>,
  req: Request,
): Promise<Toc | undefined> {
  log.debug("Read toc file:", fileOptions.src);
  let toc: TocTree | undefined;

  if (opts.toc && typeof opts.toc !== "string") {
    toc = opts.toc;
  } else {
    let pattern: RegExp;
    let src: string;
    if (typeof opts.toc === "string") {
      src = dirname(opts.toc);
      pattern = new RegExp(`${basename(opts.toc).replace(".", "\.")}$`);
    } else {
      src = fileOptions.src;
      pattern = /toc\.(yml|yaml|json)$/;
    }

    const [file] = await readSourceFiles(
      { ...fileOptions, src, component: undefined, file: undefined },
      {
        ...opts,
        read: true,
        pattern,
        req,
      },
    );

    if (file) {
      toc = file.path.endsWith(".json")
        ? JSON.parse(file.content)
        : parseYaml(file.content);
    }
  }

  return toc && flatToc(toc);
}

function flatToc(
  toc: TocTree,
  prefix = "",
  routes: Record<string, string> = {},
) {
  for (const [path, nameOrItem] of Object.entries(toc)) {
    const route = pathToUrl("/", prefix, path);
    const item = typeof nameOrItem === "string"
      ? { name: nameOrItem }
      : nameOrItem;

    routes[route] = item.name;

    if (item.children) {
      flatToc(item.children, route, routes);
    }
  }

  return routes;
}

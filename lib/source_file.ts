import {
  basename,
  dirname,
  isAbsolute,
  join,
} from "https://deno.land/std@0.119.0/path/mod.ts";
import { GithubVersions } from "./git.ts";
import { getMetaData } from "./page.ts";
import { ProviderFunction, ProviderOptions, ProviderType } from "./provider.ts";
import { ChildComponent } from "./types.ts";
import {
  getLabel,
  getRouteRegex,
  joinUrl,
  parseRemotePath,
  pathToUrl,
} from "./utils.ts";
import { Asset, AssetOptions, readTextFile } from "./asset.ts";

interface InitComponentOptions<O> {
  providers?: Array<ProviderOptions<O>>;
  repository?: string;
  req: Request;
  rev?: string;
}

export interface SourceFileOptions<O> extends AssetOptions {
  addVersion?: boolean;
  isDirectory: boolean;
  loadAssets?: boolean;
  pages?: boolean;
  prefix?: string;
  providers?: Array<ProviderOptions<O>>;
  req: Request;
  versions?: GithubVersions;
}

export class SourceFile<O = unknown> extends Asset {
  #assets: Array<Asset>;
  #component?: ChildComponent;
  #isDirectory: boolean;
  #label: string;
  #route: string;
  #routeName: string;
  #routePrefix: string;
  #versions?: GithubVersions;

  static async create<O>(
    path: string,
    opts: SourceFileOptions<O>,
  ): Promise<SourceFile<O>> {
    const content = opts.read && !opts.isDirectory
      ? await readTextFile(path, opts)
      : "";

    const assets = opts.loadAssets && !opts.isDirectory && path.endsWith(".md")
      ? await getAssets(path, content, opts)
      : [];

    const component = !opts.isDirectory && path.endsWith(".tsx")
      ? await initComponent(path, opts)
      : undefined;

    return new this(path, content, assets, component, opts);
  }

  private constructor(
    path: string,
    content: string,
    assets: Array<Asset>,
    component: ChildComponent | undefined,
    opts: SourceFileOptions<O>,
  ) {
    super(path, content, opts);

    this.#assets = assets;
    this.#component = component;
    this.#routeName = getRouteName(path);
    this.#isDirectory = opts.isDirectory;
    this.#versions = opts.versions;

    this.#routePrefix = getRoutePrefix(path, opts);
    this.#route = joinUrl(this.#routePrefix, this.#routeName);
    if (this.#routePrefix === this.#route) {
      this.#routePrefix = "/";
    }

    const headline = this.fileName.endsWith(".md") &&
      (this.fileName.startsWith("index.") ||
        this.fileName.startsWith("README.")) &&
      content.trim().match(/^#\s+([^\n]+)/)?.[1];

    if (headline) {
      this.#label = headline;
    } else if (this.#route === "/") {
      this.#label = getLabel(pathToUrl(this.fileName));
    } else if (this.#routeName === "/") {
      this.#label = getLabel(this.#route.split("/").at(-1)!.split("@")[0]);
    } else {
      this.#label = getLabel(this.#routeName);
    }
  }

  get assets() {
    return this.#assets;
  }

  get component() {
    return this.#component;
  }

  get isDirectory() {
    return this.#isDirectory;
  }

  get label() {
    return this.#label;
  }

  get route() {
    return this.#route;
  }

  get routeName() {
    return this.#routeName;
  }

  get routePrefix() {
    return this.#routePrefix;
  }

  get versions() {
    return this.#versions;
  }
}

function getRoutePrefix<O>(path: string, opts: SourceFileOptions<O>) {
  const dirName = dirname(path);
  let routePrefix = pathToUrl("/", dirName);

  // Remove base path.
  if (opts.basePath) {
    const { path: basePath } = parseRemotePath(opts.basePath);
    const regex = new RegExp(`^${pathToUrl("/", basePath)}`);
    routePrefix = joinUrl(
      "/",
      routePrefix.replace(regex, "/"),
    );
  }

  if (opts.prefix) {
    routePrefix = joinUrl(opts.prefix, routePrefix);
  }

  // Add selected version to url.
  if (
    opts.addVersion &&
    opts.versions
  ) {
    routePrefix = routePrefix.replace(
      getRouteRegex(opts.versions.all, opts.pages),
      opts.pages ? "$3@" + opts.rev + "$6$8" : "/" + opts.rev + "$5$7",
    ).replace(/\/+$/, "");
  }

  return routePrefix || "/";
}

function getRouteName(path: string) {
  const fileName = basename(path);
  let routeName = pathToUrl("/", fileName);

  if (["/index", "/README"].includes(routeName)) {
    routeName = "/";
  }

  return routeName;
}

function getAssets(
  filePath: string,
  content: string,
  opts: AssetOptions,
): Promise<Array<Asset>> {
  const imgRegex1 = /!\[[^\]]*]\(([^)]+)\)/g;
  const imgRegex2 = /!\[[^\]]*]\(([^)]+)\)/;
  const matches = content.match(imgRegex1) ?? [];
  const base = dirname(filePath);
  return Promise.all(
    matches
      .map((match): Promise<Asset> | null => {
        const [_, path] = match.match(imgRegex2) ?? [];
        return path.startsWith("http://") || path.startsWith("https://")
          ? null
          : Asset.create(join(base, path), {
            ...opts,
            base64: true,
          });
      })
      .filter((file) => file) as Array<Promise<Asset>>,
  );
}

async function initComponent<O>(
  path: string,
  options: InitComponentOptions<O>,
): Promise<ChildComponent> {
  const importPath = options.repository
    ? `https://raw.githubusercontent.com/${options.repository}/${options.rev}/${path}`
    : addProtocol(path);

  const { default: component } = await import(importPath);
  const { providers } = getMetaData(component) ?? { providers: [] };

  const props = Object.assign(
    {},
    ...await Promise.all(
      providers.map(
        (
          provider:
            | ProviderType<unknown, unknown>
            | ProviderFunction<unknown, unknown>,
        ) => {
          const props =
            options.providers?.filter(({ component }) => component === provider)
              .map(({ props }) => props) ?? [];

          const opts = Object.assign({}, ...props);

          return isProviderType(provider)
            ? new provider().onInit(options.req, opts)
            : provider(options.req, opts);
        },
      ),
    ),
  );
  return { component, props };
}

function isProviderType<V extends unknown, T extends unknown>(
  p: unknown | ProviderType<V, T>,
): p is ProviderType<V, T> {
  // deno-lint-ignore no-explicit-any
  return typeof (p as any).prototype.onInit === "function";
}

function addProtocol(script: string): string {
  const hasProtocol: boolean = script.startsWith("http://") ||
    script.startsWith("https://") || script.startsWith("file://");
  if (!hasProtocol) {
    script = "file://" +
      (isAbsolute(script) ? script : join(Deno.cwd(), script));
  }
  return script;
}

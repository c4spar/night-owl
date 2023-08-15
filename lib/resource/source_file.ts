import { Asset, AssetOptions } from "./asset.ts";
import { GithubVersions } from "../fs/git/get_versions.ts";
import { readAssets } from "../fs/read_assets.ts";
import { readFile } from "../fs/read_file.ts";
import { initComponent } from "../init_component.ts";
import { pathToRoute } from "../path_to_route.ts";
import { ProviderOptions } from "../provider.ts";
import { ChildComponent } from "../types.ts";
import {
  addLatestVersion,
  getLabel,
  pathToUrl,
  removeVersion,
} from "../utils.ts";

export type SourceFileOptions<O> = AssetOptions & {
  addVersion?: boolean;
  isDirectory?: boolean;
  loadAssets?: boolean;
  pages?: boolean;
  prefix?: string;
  providers?: Array<ProviderOptions<O>>;
  req: Request;
  versions?: GithubVersions;
  component?: unknown;
};

export class SourceFile<O = unknown> extends Asset {
  #assets: Array<Asset>;
  #component?: ChildComponent;
  #isDirectory: boolean;
  #name: string;
  #route: string;
  #mainRoute: string;
  #latestRoute: string;
  #routeName: string;
  #routePrefix: string;
  #versions?: GithubVersions;

  static async create<O>(
    path: string,
    opts: SourceFileOptions<O>,
  ): Promise<SourceFile<O>> {
    const content = opts.read && !opts.isDirectory
      ? await readFile(path, opts)
      : "";

    const assets = opts.loadAssets && !opts.isDirectory && path.endsWith(".md")
      ? await readAssets(path, content, opts)
      : [];

    const component =
      opts.component || (!opts.isDirectory && path.endsWith(".tsx"))
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

    const { routePrefix, routeName, route } = pathToRoute(path, opts);

    this.#assets = assets;
    this.#component = component;
    this.#isDirectory = opts.isDirectory === true;
    this.#route = route;
    this.#mainRoute = removeVersion(route, opts.versions?.all, opts.pages);
    this.#latestRoute = opts.versions?.latest
      ? addLatestVersion(route, opts.versions, opts.pages)
      : this.#mainRoute;
    this.#routeName = routeName;
    this.#routePrefix = routePrefix;
    this.#versions = opts.versions;

    const headline = this.fileName.endsWith(".md") &&
      (this.fileName.startsWith("index.") ||
        this.fileName.startsWith("README.")) &&
      content.trim().match(/^#\s+([^\n]+)/)?.[1];

    if (headline) {
      this.#name = headline;
    } else if (this.#route === "/") {
      this.#name = getLabel(pathToUrl(this.fileName));
    } else if (this.#routeName === "/") {
      this.#name = getLabel(this.#route.split("/").at(-1)!.split("@")[0]);
    } else {
      this.#name = getLabel(this.#routeName);
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

  get name() {
    return this.#name;
  }

  set name(label: string) {
    this.#name = label;
  }

  get route() {
    return this.#route;
  }

  get mainRoute() {
    return this.#mainRoute;
  }

  get latestRoute() {
    return this.#latestRoute;
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

  override toJson(compact = true) {
    return {
      ...{
        ...super.toJson(compact),
        isDirectory: this.#isDirectory,
        name: this.#name,
        routeName: this.#routeName,
        routePrefix: this.#routePrefix,
        route: this.#route,
        mainRoute: this.#mainRoute,
        latestRoute: this.#latestRoute,
      },
      ...compact ? {} : {
        assets: this.#assets,
        component: this.#component,
        versions: this.#versions,
      },
    };
  }
}

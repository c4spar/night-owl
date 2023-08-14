import { isAbsolute, join } from "../deps.ts";
import { getMetaData } from "./page.ts";
import { ProviderFunction, ProviderOptions, ProviderType } from "./provider.ts";
import { ChildComponent } from "./types.ts";

interface InitComponentOptions<O> {
  providers?: Array<ProviderOptions<O>>;
  repository?: string;
  req: Request;
  rev?: string;
  component?: unknown;
}

export async function initComponent<O>(
  path: string,
  options: InitComponentOptions<O>,
): Promise<ChildComponent> {
  const importPath = options.repository
    ? `https://raw.githubusercontent.com/${options.repository}/${options.rev}/${path}`
    : addProtocol(path);

  const { default: component } = options.component
    ? { default: options.component }
    : await import(importPath);

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

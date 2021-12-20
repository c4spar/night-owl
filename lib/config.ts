import { getResources, ResourceOptions, Resources } from "./resource.ts";

export type AppOptions = ResourceOptions;

export type AppConfig = AppOptions & Resources;

export async function createConfig(options: AppOptions) {
  const { versions, examples, benchmarks, docs, modules } = await getResources(
    options,
  );

  return {
    modules,
    ...options,
    versions,
    examples,
    benchmarks,
    docs,
  };
}

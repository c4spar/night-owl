import { Module } from "./resource.ts";

export const Config = {
  repository: "c4spar/deno-cliffy",
  directories: {
    benchmarks: "data",
    docs: "docs",
    examples: "examples",
  },
  modules: [] as Array<Module>,
} as const;

export type Config = typeof Config;

export type ConfigOptions = Partial<Omit<Config, "directories">> & {
  directories?: Partial<Config["directories"]>;
};

export function initConfig(config: ConfigOptions) {
  Object.assign(Config, config, {
    directories: {
      ...Config.directories,
      ...config.directories,
    },
  });
}

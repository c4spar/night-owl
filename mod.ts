import { setupLog } from "./lib/log.ts";

await setupLog();

/** COMPONENTS */
export { NotFound, type NotFoundOptions } from "./components/not_found.tsx";
export { AnimatedText } from "./components/animated_text.tsx";
export {
  type ButtonOptions,
  PrimaryButton,
  SecondaryButton,
} from "./components/buttons.tsx";
export { Code } from "./components/code.tsx";

/** LIB */
export { type ComponentType, Page, type PageOptions } from "./lib/page.ts";
export { serve } from "./lib/serve.tsx";
export {
  type AppConfig,
  type CreateConfigOptions,
  type NavOptions,
} from "./lib/config.ts";
export {
  type Provider,
  type ProviderFunction,
  type ProviderType,
} from "./lib/provider.ts";
export {
  getFiles,
  type GetFilesOptions,
  type ReadDirOptions,
} from "./lib/resource.ts";
export { SourceFile, type SourceFileOptions } from "./lib/source_file.ts";
export { Asset, type AssetOptions } from "./lib/asset.ts";
export { bgMain, textMain, transformGpu } from "./lib/styles.ts";
export { capitalize, sortByKey } from "./lib/utils.ts";
export { type ChildComponent, type Children } from "./lib/types.ts";

/** DEPS */
export {
  apply,
  Component,
  css,
  Fragment,
  h,
  Helmet,
  render,
  theme,
  tw,
  twColors,
} from "./deps.ts";

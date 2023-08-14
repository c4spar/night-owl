import { setupLog } from "./lib/log.ts";

await setupLog();

/** COMPONENTS */
export { NotFound, type NotFoundOptions } from "./components/not_found.tsx";
export { AnimatedText } from "./components/animated_text.tsx";
export { CodeBlock } from "./components/code_block.tsx";

/** LIB */
export { type ComponentType, Page, type PageOptions } from "./lib/page.ts";
export { serve, type ServeOptions } from "./lib/serve.tsx";
export {
  type AppConfig,
  type CreateConfigOptions,
  type NavOptions,
  type Script,
} from "./lib/config/config.ts";
export {
  type Provider,
  type ProviderFunction,
  type ProviderOptions,
  type ProviderType,
} from "./lib/provider.ts";
export {
  readSourceFiles,
  type ReadSourceFilesOptions,
} from "./lib/fs/read_source_files.ts";
export { SourceFile, type SourceFileOptions } from "./lib/source_file.ts";
export { Asset, type AssetOptions } from "./lib/asset.ts";
export { styles } from "./lib/styles.ts";
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
  type Theme,
  theme,
  tw,
  twColors,
} from "./deps.ts";
export { type ReadDirOptions } from "./lib/fs/read_dir.ts";
export { type GithubVersions } from "./lib/fs/git/get_versions.ts";

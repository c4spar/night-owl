import { SourceFile, SourceFileOptions } from "../resource/source_file.ts";

export function readSourceFile<O>(
  path: string,
  opts: SourceFileOptions<O>,
): Promise<SourceFile<O>> {
  return SourceFile.create(path, opts);
}

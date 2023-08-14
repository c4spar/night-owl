export function denoReadDir(path: string): AsyncIterable<Deno.DirEntry> {
  return Deno.readDir(path);
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function sortByKey<K extends string>(name: K) {
  return (a: Record<K, string>, b: Record<K, string>) => {
    if (a[name] < b[name]) {
      return -1;
    }
    if (a[name] > b[name]) {
      return 1;
    }
    return 0;
  };
}

export interface FileOptions {
  fileName: string;
  name: string;
  content: string;
}

export type ReadDirCallback<T extends FileOptions> = (file: FileOptions) => T;

export async function readDir<T extends FileOptions>(
  path: string,
  fn?: ReadDirCallback<T>,
): Promise<Array<T>> {
  const examples: Array<T> = [];
  for await (const file of Deno.readDir(path)) {
    if (file.isFile) {
      const opts: FileOptions = {
        fileName: file.name,
        name: file.name.replace(/\.ts$/, ""),
        content: await Deno.readTextFile(`${path}/${file.name}`),
      };
      examples.push(fn?.(opts) ?? opts as T);
    }
  }

  return examples.sort(sortByKey("name"));
}

export interface Example extends FileOptions {
  shebang: string;
}

export function getExamples(): Promise<Array<Example>> {
  return readDir("examples", (file) => ({
    ...file,
    content: file.content.replace(/#!.+\n+/, ""),
    shebang: file.content.split("\n")[0],
  }));
}

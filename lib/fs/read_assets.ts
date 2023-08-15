import { dirname, join } from "../../deps.ts";
import { Asset, AssetOptions } from "../resource/asset.ts";

export function readAssets(
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

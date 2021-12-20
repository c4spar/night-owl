export class Cache<T> {
  static readonly #isEnabled: boolean =
    Deno.env.get("NO_CACHE")?.toLowerCase() !== "true";

  #cache = new Map<string, T>();

  get<V extends T = T>(key: string): V | undefined {
    return Cache.#isEnabled ? this.#cache.get(key) as V | undefined : undefined;
  }

  set<V extends T = T>(key: string, value: V): void {
    this.#cache.set(key, value);
  }
}

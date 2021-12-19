export class Cache<T> {
  #cache = new Map<string, T>();

  get(key: string): T | undefined {
    return this.isEnabled() ? this.#cache.get(key) : undefined;
  }

  set(key: string, value: T): void {
    this.#cache.set(key, value);
  }

  isEnabled(): boolean {
    return Deno.env.get("NO_CACHE")?.toLowerCase() !== "true";
  }
}

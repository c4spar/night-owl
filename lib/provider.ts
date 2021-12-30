export interface ProviderType<T> {
  new (): Provider<T>;
}

export interface Provider<T> {
  onInit(req: Request): T | Promise<T>;
}

export type ProviderFunction<T> = (req: Request) => T | Promise<T>;

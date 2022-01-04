export type ProviderOptions<O> = {
  component: ProviderType<unknown, O>;
  props: O;
};

export interface ProviderType<R, O = unknown> {
  new (): Provider<R, O>;
}

export interface Provider<R, O = unknown> {
  onInit(req: Request, options: O): R | Promise<R>;
}

export type ProviderFunction<R, O = unknown> = (
  req: Request,
  options: O,
) => R | Promise<R>;

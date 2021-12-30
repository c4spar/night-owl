import { Component } from "https://deno.land/x/nano_jsx@v0.0.26/component.ts";
import { ProviderFunction, ProviderType } from "./provider.ts";

export interface ComponentType<T, S> {
  new (props: T): Component<T, S>;
}

export interface PageDecoratorOptions<T> {
  provider: Array<ProviderType<T> | ProviderFunction<T>>;
}

const pageMetaData = new WeakMap<
  // deno-lint-ignore no-explicit-any
  ComponentType<any, any>,
  // deno-lint-ignore no-explicit-any
  PageDecoratorOptions<any>
>();

export function Page<P, S>(props: PageDecoratorOptions<P>) {
  return function <T extends ComponentType<P, S>>(
    constructor: T,
  ) {
    setMetaData(constructor, props);
  };
}

export function setMetaData<T, S>(
  type: ComponentType<T, S>,
  value: PageDecoratorOptions<T>,
): void {
  pageMetaData.set(type, value);
}

export function getMetaData<T>(
  type: ComponentType<unknown, unknown>,
): PageDecoratorOptions<T> | undefined {
  return pageMetaData.get(type) as PageDecoratorOptions<T> | undefined;
}

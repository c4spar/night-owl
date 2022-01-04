import { Component } from "https://deno.land/x/nano_jsx@v0.0.26/component.ts";
import { ProviderFunction, ProviderType } from "./provider.ts";

export interface ComponentType<T, S> {
  new (props: T): Component<T, S>;
}

export interface PageDecoratorOptions<R, O> {
  providers: Array<ProviderType<R, O> | ProviderFunction<R, O>>;
}

const pageMetaData = new WeakMap<
  // deno-lint-ignore no-explicit-any
  ComponentType<any, any>,
  // deno-lint-ignore no-explicit-any
  PageDecoratorOptions<any, any>
>();

export function Page<P, S>(props: PageDecoratorOptions<P, unknown>) {
  return function <T extends ComponentType<P, S>>(
    constructor: T,
  ) {
    addMetaData(constructor, props);
  };
}

export function addMetaData<T, S>(
  type: ComponentType<T, S>,
  value: PageDecoratorOptions<T, unknown>,
): void {
  const meta = getMetaData(type) ?? {};
  setMetaData(type, { ...meta, ...value });
}

export function setMetaData<T, S>(
  type: ComponentType<T, S>,
  value: PageDecoratorOptions<T, unknown>,
): void {
  pageMetaData.set(type, value);
}

export function getMetaData<T, S>(
  type: ComponentType<T, S>,
): PageDecoratorOptions<T, unknown> | undefined {
  return pageMetaData.get(type) as PageDecoratorOptions<T, unknown> | undefined;
}

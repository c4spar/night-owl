export type ChildComponent<T = unknown, V = unknown> = {
  component: T;
  props: V;
};

export type Children<
  T extends string | ChildComponent = string | ChildComponent,
> = T | Array<T>;

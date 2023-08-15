export type ChildComponent<T = unknown, V = unknown> = {
  component: T;
  props: V;
};

export type Children<
  T extends string | ChildComponent = string | ChildComponent,
> = T | Array<T>;

export type DistributiveOmit<T, K extends PropertyKey> = T extends infer U
  ? Omit<U, K>
  : never;

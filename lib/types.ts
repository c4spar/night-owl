export type ChildComponent = { component: unknown; props: unknown };

export type Children<
  T extends string | ChildComponent = string | ChildComponent,
> = T | Array<T>;

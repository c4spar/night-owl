/** @jsx h */

import { h, render, tw } from "../deps.ts";

type Comp = { component: unknown; props: unknown };
type CompDef = string | Comp | Array<Comp | string>;

export interface ButtonOptions {
  href?: string;
  children: CompDef;
  class?: string;
  style?: string;
}

function Button({ class: className, href, children, style }: ButtonOptions) {
  const css = tw`text-white font-bold
   text-sm px-4 py-3 rounded shadow hover:shadow-md outline-none
   focus:outline-none mr-1 mb-1 ease-linear transition duration-150
   inline-flex items-center`;

  const content = Array.isArray(children)
    ? children.map((child) => render(child))
    : render(children);

  return (
    <button
      type="button"
      onclick={`location.href='${href}';`}
      class={`${css} ${className}`}
      style={style}
    >
      {content}
    </button>
  );
}

export function SecondaryButton(
  { class: className, ...options }: ButtonOptions,
) {
  return Button({
    class: `${tw`bg-indigo-500 active:bg-indigo-600`} ${className}`,
    ...options,
  });
}

export function PrimaryButton({ class: className, ...options }: ButtonOptions) {
  return Button({
    class: `${tw`bg-purple-500 active:bg-purple-600`} ${className}`,
    ...options,
  });
}

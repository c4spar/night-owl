/** @jsx h */

import { h } from "../deps.ts";
import { Children } from "../lib/types.ts";
import { bgMain, transformGpu, tw } from "../mod.ts";

export function PageBackground({ children }: { children?: Children }) {
  return (
    <div
      class={tw`${transformGpu} ${bgMain} fixed top-0 overflow-hidden
        w-full h-screen min-h-full`}
    >
      {children ?? null}
    </div>
  );
}

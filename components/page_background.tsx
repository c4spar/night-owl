/** @jsx h */

import { h, tw } from "../deps.ts";
import { bgMain, transformGpu } from "../lib/styles.ts";

export function PageBackground() {
  return (
    <div
      class={tw`${transformGpu} ${bgMain} fixed top-0 overflow-hidden
        w-full h-screen min-h-full`}
    >
      <svg
        height="240"
        width="680"
        class={tw`absolute top-0 right-0
          fill-current text-black opacity-5 dark:opacity-10`}
      >
        <polygon points="0,0 680,0 680,240" />
      </svg>
      <svg
        height="1300"
        width="450"
        class={tw`absolute top-0 left-0
          fill-current text-black opacity-5 dark:opacity-10`}
      >
        <polygon points="0,0 450,0 0,1300" />
      </svg>
    </div>
  );
}

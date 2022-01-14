/** @jsx h */

import { h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { Children } from "../lib/types.ts";

export function PageBackground({ children }: { children?: Children }) {
  return (
    <div
      class={tw
        `${styles.transform.primary} ${styles.bg.primary} fixed top-0 overflow-hidden
        w-full h-screen min-h-full`}
    >
      {children ?? null}
    </div>
  );
}

/** @jsx h */

import { Fragment, h, log, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { AnimatedText } from "./animated_text.tsx";

export interface NotFoundOptions {
  url: string;
}

export function NotFound({ url }: NotFoundOptions) {
  log.error("Route not found: %s", url);
  return (
    <Fragment>
      <AnimatedText
        speed={6}
        class={tw`pl-5 pr-5 mt([5rem] md:[7rem] lg:[10rem])
          text-xl text-center ${styles.font.primary} font-bold
          ${styles.text.secondary} ${styles.transform.primary}`}
      >
        Oops, you have requested a site that doesn't exist!
      </AnimatedText>
      <div
        class={tw`pl-5 pr-5 mt-[5rem] ${styles.font.primary} font-bold
        text([10rem] md:[15rem] lg:[25rem]) text-center opacity-10
        ${styles.text.secondary} ${styles.transform.primary}`}
      >
        404
      </div>
    </Fragment>
  );
}

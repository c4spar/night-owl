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
        class={tw`container mx-auto p-5 mt-[10%] font-nerd text-xl text-center`}
      >
        Oops, you have requested a site that doesn't exist!
      </AnimatedText>
      <div class={tw`pl-5 pr-5 mt-[5rem]
        font-mija-bold text([10rem] md:[15rem] lg:[25rem]) text-center opacity-10
        ${styles.text.secondary} ${styles.transform.primary}`}>404
      </div>
    </Fragment>
  );
}

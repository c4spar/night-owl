/** @jsx h */

import { Fragment, h, log, tw } from "../deps.ts";
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
        Oops, you have requested a site that does not exist!
      </AnimatedText>
    </Fragment>
  );
}

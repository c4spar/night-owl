/** @jsx h */

import { Component, Fragment, h, tw } from "../deps.ts";

interface AnimatedTextOptions {
  children: string | Array<string>;
  webKitFix?: boolean;
  class?: string;
  speed?: number;
  delay?: number;
  evenColor?: string;
  oddColor?: string;
  wordSpace?: number;
}

export class AnimatedText extends Component<AnimatedTextOptions> {
  render() {
    tw`animate-rainbow`;
    return (
      <Fragment>
        <div
          class={`${this.props.class} ${tw`${
            this.props.wordSpace
              ? `space-x-${this.props.wordSpace}`
              : `space-x-1`
          }`}`}
        >
          {(this.props.children as Array<string>).join(" ")
            .split(" ").map((word, i) => (
              <div
                class={tw`inline-block ${(i % 2 === 0
                  ? this.props.evenColor
                  : this.props.oddColor)}`}
              >
                {word.split("")
                  .map((char, ii) => (
                    <span
                      style={`animation-delay: ${
                        (((i * 10) + ii) * (this.props.speed ?? 10)) +
                        (this.props.delay ?? 0)
                      }ms;`}
                      class={tw`inline-block` + " " + (this.props.webKitFix
                        ? "moz-animate-left-right"
                        : tw
                          `animate-left-right transform-gpu opacity-0 -translate-x-72 -scale-[0.3]`)}
                    >
                      {char}
                    </span>
                  ))}
              </div>
            )).flat()}
        </div>
      </Fragment>
    );
  }
}

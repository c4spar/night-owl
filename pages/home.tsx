/** @jsx h */

import { PrimaryButton, SecondaryButton } from "../components/buttons.tsx";
import { Editor } from "../components/editor.tsx";
import { ArrowForward } from "../components/icons.tsx";
import { Component, Fragment, h, Helmet, render, tw } from "../deps.ts";
import { Example } from "../lib/utils.ts";

interface HomePageOptions {
  examples: Array<Example>;
}

export class HomePage extends Component<HomePageOptions> {
  label(label: string, size: number) {
    return (
      <span class={tw`text-xl leading-6 sm:text-2xl`}>
        {label}
      </span>
    );
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Cliffy</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap"
            rel="stylesheet"
          />
        </Helmet>

        <h2
          class={tw
            `font-display font-bold text-center dark:text-gray-200 mb-16 text-[5rem] leading-[4rem] sm:text-[10rem] sm:leading-[8rem] lg:text-[14rem] lg:leading-[10rem] lg:mb-20 xl:text-[18rem] xl:leading-[14rem]`}
        >
          CLIFFY
        </h2>

        <div class={tw`xl:flex xl:items-center xl:space-x-16`}>
          <div class={tw`flex-1 space-y-16 pb-16`}>
            <h2
              class={tw`font-bold text-center text-2xl leading-7 sm:text-3xl`}
            >
              The Framework for Building Interactive Commandline Tools with Deno
            </h2>

            <div class={tw`text-center`}>
              Cliffy is a fullstack CLI Framework that lets you write
              interactive Command Line Tools with Deno.
            </div>

            <div class={tw`flex justify-center space-x-4`}>
              <PrimaryButton
                href="/docs"
                class={tw`sm:text-lg xl:text-sm 2xl:text-lg`}
              >
                Get Started
                <ArrowForward />
              </PrimaryButton>
              <SecondaryButton
                href="/docs"
                class={tw`sm:text-lg xl:text-sm 2xl:text-lg`}
              >
                Documentation
              </SecondaryButton>
            </div>
          </div>

          <div class={tw`flex-1`}>
            <Editor tabs={this.props.examples} />
          </div>
        </div>
      </Fragment>
    );
  }
}

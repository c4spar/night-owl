/** @jsx h */

import { PrimaryButton, SecondaryButton } from "../components/buttons.tsx";
import { Editor } from "../components/editor.tsx";
import { ArrowForward } from "../components/icons.tsx";
import { AnimatedText } from "../components/animated_text.tsx";
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
            href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Titan+One&family=Varela+Round&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://mshaugh.github.io/nerdfont-webfonts/build/firacode-nerd-font.css"
          />
        </Helmet>
        <h1>
          <AnimatedText
            speed={30}
            delay={200}
            animation="animate-left-right"
            // bg-black bg-opacity-5
            // dark:bg-white dark:bg-opacity-5
            class={tw`font-display font-bold text-center
                 py-8 xl:mb-8
                 text-[5rem] leading-[4rem]
                 sm:text-[10rem] sm:leading-[8rem]
                 lg:text-[14rem] lg:leading-[10rem]
                 xl:text-[18rem] xl:leading-[14rem]`}
          >
            CLIFFY
          </AnimatedText>
        </h1>

        <div
          class={tw
            `container mx-auto p-4 xl:flex xl:items-center xl:space-x-16`}
        >
          <div class={tw`flex-1 space-y-16 lg:pt-10 xl:pt-0 pb-12 xl:pb-20`}>
            <AnimatedText
              delay={700}
              speed={2}
              animation="animate-left-right"
              evenColor="text-purple-500"
              oddColor="text-blue-400"
              wordSpace={2}
              class={tw`font-nerd font-bold text-center
                 text-2xl leading-7 sm:text-3xl space-x-2`}
            >
              The Framework for Building Interactive Commandline Tools with Deno
            </AnimatedText>

            <AnimatedText
              delay={1300}
              speed={1}
              class={tw`font-bold text-center`}
            >
              Cliffy is a fullstack CLI Framework that lets you write
              interactive Command Line Tools with Deno.
            </AnimatedText>

            <div class={tw`flex justify-center space-x-4`}>
              <PrimaryButton
                href="/docs"
                style="animation-delay: 1900ms;"
                class={tw`sm:text-lg xl:text-sm 2xl:text-lg
                   opacity-0 transform-gpu animate-slide-in`}
              >
                Get Started
                <ArrowForward class={tw`transform-gpu animate-bounce-right`} />
              </PrimaryButton>
              <SecondaryButton
                href="/docs"
                style="animation-delay: 2000ms;"
                class={tw`sm:text-lg xl:text-sm 2xl:text-lg
                     opacity-0 transform-gpu animate-slide-in`}
              >
                Documentation
              </SecondaryButton>
            </div>
          </div>

          <div class={tw`flex-1 transform-gpu`}>
            <Editor tabs={this.props.examples} />
          </div>
        </div>
      </Fragment>
    );
  }
}

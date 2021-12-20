/** @jsx h */

import { DarkModeSwitch } from "./dark_mode_switch.tsx";
import { Link } from "./link.tsx";
import { Component, h, tw } from "../deps.ts";
import { bgMain, transformGpu } from "../lib/styles.ts";

export class Header extends Component {
  render() {
    return (
      <header
        class={tw`
          ${transformGpu} ${bgMain}
          w-full
          flex flex-wrap p-5 flex-col md:flex-row items-center 
          backdrop-blur
          lg:z-50 lg:border-b lg:border-gray-900 lg:border-opacity-10
          dark:lg:border-gray-200 dark:lg:border-opacity-10
          bg-opacity-95 dark:bg-opacity-95
          supports-backdrop-blur:bg-white supports-backdrop-blur:bg-opacity-60
        `}
      >
        <a
          class={tw`flex font-medium items-center mb-4 md:mb-0`}
          href="/"
        >
          <span class={tw`ml-3 text-xl`}>
            Cliffy
          </span>
        </a>

        <nav
          class={tw`flex flex-wrap items-center md:ml-auto
            text-base justify-center space-x-3`}
        >
          <Link href="https://doc.deno.land/https://deno.land/x/cliffy/mod.ts">
            API
          </Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/benchmarks">Benchmarks</Link>
          <Link href="https://github.com/c4spar/deno-cliffy">Github</Link>
        </nav>

        <DarkModeSwitch class={tw`flex ml-3`} />
      </header>
    );
  }
}

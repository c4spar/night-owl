/** @jsx h */

import { Component, h, tw } from "../deps.ts";

interface LinkOptions {
  label: string;
  href?: string;
}

export class Header extends Component {
  render() {
    return (
      <header
        class={tw`flex flex-wrap p-5 flex-col md:flex-row items-center`}
      >
        <a
          class={tw`flex font-medium items-center text-gray-300 mb-4 md:mb-0`}
          href="/"
        >
          <span class={tw`ml-3 text-xl`}>Cliffy</span>
        </a>
        <nav
          class={tw
            `md:ml-auto flex flex-wrap items-center text-base justify-center`}
        >
          <Link
            label="API"
            href="https://doc.deno.land/https://deno.land/x/cliffy/mod.ts"
          />
          <Link label="Documentation" href="/docs" />
          <Link label="Benchmarks" href="/benchmarks" />
          <Link label="Github" href="https://github.com/c4spar/deno-cliffy" />
        </nav>
      </header>
    );
  }
}

function Link({ href, label }: LinkOptions) {
  const target = href?.startsWith("https://") || href?.startsWith("http://")
    ? "_blank"
    : undefined;

  return (
    <a
      class={tw
        `mr-5 hover:text-gray-200 border-b-2 pb-1 border-transparent hover:border-indigo-500`}
      href={href}
      target={target}
    >
      {label}
    </a>
  );
}

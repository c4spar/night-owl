/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, h } from "../deps.ts";

interface LinkOptions {
  label: string;
  href?: string;
}

export class Navigation extends Component {
  render() {
    return (
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a
          class="flex title-font font-medium items-center text-gray-300 mb-4 md:mb-0"
          href="/"
        >
          <span class="ml-3 text-xl">Cliffy</span>
        </a>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link
            label="API"
            href="https://doc.deno.land/https://deno.land/x/cliffy/mod.ts"
          />
          <Link label="Manual" href="/manual" />
          <Link label="Benchmarks" href="/benchmarks" />
          <Link label="Github" href="https://github.com/c4spar/deno-cliffy" />
        </nav>
      </div>
    );
  }
}

function Link({ href, label }: LinkOptions) {
  const target = href?.startsWith("https://") || href?.startsWith("http://")
    ? "_blank"
    : undefined;

  return (
    <a class="mr-5 hover:text-gray-200" href={href} target={target}>{label}</a>
  );
}

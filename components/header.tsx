/** @jsx h */

import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { DarkModeSwitch } from "./dark_mode_switch.tsx";
import { Link, LinkOptions } from "./link.tsx";
import { Component, distinctBy, h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { Iconify } from "./iconify.tsx";

export interface NavItemOptions extends Omit<LinkOptions, "children"> {
  label: string;
}

export interface HeaderOptions {
  config: AppConfig;
  file?: SourceFile;
}

export class Header extends Component<HeaderOptions> {
  render() {
    return (
      <header
        class={tw`
          ${styles.transform.primary} ${styles.bg.secondary}
          flex flex-wrap flex-col md:flex-row items-center 
          border-b border-gray-200 dark:border-gray-700
          bg-opacity-95 dark:bg-opacity-95 font-bold
          p-5
        `}
      >
        {this.#renderLabel()}

        <nav
          class={tw`flex flex-wrap items-center md:ml-auto
            text-base justify-center space-x-5`}
        >
          {this.#renderLinks()}

          <Link
            href={`https://github.com/${
              this.props.file?.repository ?? this.props.config.repository
            }`}
          >
            <Iconify
              icon="akar-icons:github-fill"
              class={tw
                `text-2xl inline ${styles.text.secondary} hover:(${styles.text.primary})`}
            />
          </Link>

          <DarkModeSwitch class={tw`flex ml-3`} />
        </nav>
      </header>
    );
  }

  #renderLabel() {
    if (!this.props.config.name) {
      return null;
    }
    return (
      <a
        class={tw
          `flex ${styles.font.primary} font-bold items-center mb-4 md:mb-0`}
        href="/"
      >
        <span class={tw`ml-3 text-3xl`}>
          {this.props.config.name}
        </span>
      </a>
    );
  }

  #renderLinks() {
    return this.#getLinks().map((link) => this.#renderLink(link));
  }

  #getLinks(): Array<NavItemOptions> {
    return distinctBy([
      ...this.getPageLinks(),
      ...this.#getNavLinks(),
    ], (link) => link.href);
  }

  getPageLinks(): Array<NavItemOptions> {
    if (!this.props.config.pages) {
      return [];
    }
    return this.props.config.sourceFiles
      .filter((file) => file.routePrefix === "/" && file.route !== "/")
      .map((file) => ({
        label: file.name,
        href: file.route,
      }));
  }

  #getNavLinks(): Array<NavItemOptions> {
    return this.props.config.nav?.items?.map(
      ({ href, ...props }) => ({
        ...props,
        href: href?.replace(/{(version|rev)}/, this.props.config.rev),
      }),
    ) ?? [];
  }

  #renderLink({ label, href, ...props }: NavItemOptions) {
    return (
      <Link
        {...props}
        class={tw
          `pb-1 pt-2 border-b-2 border-transparent hover:border-indigo-500 text-lg`}
        href={href}
      >
        {label}
      </Link>
    );
  }
}

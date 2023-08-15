/** @jsx h */

import { AppConfig } from "../lib/config/config.ts";
import { SourceFile } from "../lib/resource/source_file.ts";
import { DarkModeSwitch } from "./dark_mode_switch.tsx";
import { Link, LinkOptions } from "./link.tsx";
import { apply, Component, css, distinctBy, h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { Iconify } from "./iconify.tsx";
import { DocSearch } from "./docsearch.tsx";

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
            href={`https://github.com/${this.props.config.repository}`}
          >
            <Iconify
              icon="akar-icons:github-fill"
              class={tw`text-2xl inline ${styles.text.secondary} hover:(${styles.text.primary})`}
            />
          </Link>

          {this.props.config.docSearch
            ? (
              <DocSearch
                class={tw`${
                  css({
                    button: apply`md:w-56 h-10 dark:bg-gray-700!`,
                    ".DocSearch-Button-Placeholder": apply`mt-[1px]`,
                  })
                }`}
                config={this.props.config.docSearch}
              />
            )
            : null}

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
        class={tw`flex ${styles.font.primary} font-bold items-center mb-4 md:mb-0`}
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
    return [
      ...this.getPageLinks(),
      ...this.#getNavLinks(),
    ];
  }

  getPageLinks(): Array<NavItemOptions> {
    if (!this.props.config.pages) {
      return [];
    }
    const files = this.props.config.sourceFiles.filter(
      (file) => file.routePrefix === "/" && file.route !== "/",
    );

    return distinctBy(files, (link) => link.latestRoute).map((file) => ({
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
        class={tw`pb-1 pt-2 border-b-2 border-transparent hover:border-indigo-500 text-lg`}
        href={href}
      >
        {label}
      </Link>
    );
  }
}

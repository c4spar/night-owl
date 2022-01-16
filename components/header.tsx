/** @jsx h */

import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { DarkModeSwitch } from "./dark_mode_switch.tsx";
import { Link, LinkOptions } from "./link.tsx";
import { Component, h, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";

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
          w-full h-[5.2rem]
          flex flex-wrap p-5 flex-col md:flex-row items-center 
          backdrop-blur
          lg:z-50 lg:border-b lg:border-gray-200
          dark:lg:border-gray-700
          bg-opacity-95 dark:bg-opacity-95
          supports-backdrop-blur:bg-white supports-backdrop-blur:bg-opacity-60
        `}
      >
        {this.#renderLabel()}

        <nav
          class={tw`flex flex-wrap items-center md:ml-auto
            text-base justify-center space-x-3`}
        >
          {this.#renderPageLinks()}
          {this.#renderNavLinks()}

          <Link
            href={`https://github.com/${
              this.props.file?.repository ?? this.props.config.repository
            }`}
          >
            Github
          </Link>
        </nav>

        <DarkModeSwitch class={tw`flex ml-3`} />
      </header>
    );
  }

  #renderLabel() {
    if (!this.props.config.name) {
      return null;
    }
    return (
      <a
        class={tw`flex font-medium items-center mb-4 md:mb-0`}
        href="/"
      >
        <span class={tw`ml-3 text-xl`}>
          {this.props.config.name}
        </span>
      </a>
    );
  }

  #renderPageLinks() {
    if (!this.props.config.pages) {
      return null;
    }
    return this.props.config.sourceFiles
      .filter((file) => file.routePrefix === "/" && file.route !== "/")
      .map((file) => <Link href={file.route}>{file.name}</Link>);
  }

  #renderNavLinks() {
    return this.props.config.nav?.items?.map(
      ({ label, href, ...props }) => (
        <Link
          {...props}
          href={href?.replace(/{(version|rev)}/, this.props.config.rev)}
        >
          {label}
        </Link>
      ),
    ) ?? null;
  }
}

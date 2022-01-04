/** @jsx h */

import { AppConfig } from "../lib/config.ts";
import { parseRoute, sortByKey } from "../lib/utils.ts";
import { ModuleSelection } from "./module_selection.tsx";
import { Navigation } from "./navigation.tsx";
import { Component, Fragment, h, log, tw } from "../deps.ts";
import { FileOptions } from "../lib/resource.ts";

export interface PageNavigationOptions {
  config: AppConfig;
  file: FileOptions;
}

export class PageNavigation extends Component<PageNavigationOptions> {
  #path: string;
  #pagePrefix: string;
  #selectedPage: string;

  constructor(props: PageNavigationOptions) {
    super(props);

    const {
      path,
      pagePrefix,
      selectedPage,
    } = parseRoute(
      this.props.file.route,
      this.props.config.versions.all,
      this.props.config.pages,
    );

    this.#path = path;
    this.#pagePrefix = pagePrefix;
    this.#selectedPage = selectedPage;
  }

  render() {
    const dropDownFiles = this.#getDropDownFiles();
    const navFiles = this.#getNavFiles();

    return (
      <Fragment>
        <ModuleSelection
          class={tw`mb-3`}
          files={dropDownFiles}
          selected={this.#selectedPage}
        />
        <Navigation>
          {navFiles.map((file) => this.#renderNavLink(file))}
        </Navigation>
      </Fragment>
    );
  }

  #renderNavLink(file: FileOptions) {
    const hasDuplicateRoutes = this.props.config.sourceFiles.find(
      (f) => f !== file && f.route === file.route,
    );

    if (file.isDirectory && hasDuplicateRoutes) {
      file = hasDuplicateRoutes;
    } else if (!file.isDirectory && hasDuplicateRoutes) {
      return null;
    }

    const isRootFile = file.routePrefix === "/";
    const bold = isRootFile || hasDuplicateRoutes ? "font-bold" : "";
    const rem = file.route.split("/").length - 2;
    const marginLeft = `pl-[${rem}rem]`;

    return file.content || hasDuplicateRoutes
      ? (
        <a
          class={tw`p-3 w-full ${marginLeft} ${bold}`}
          href={file.route}
        >
          {file.label || "UNKNOWN"}
        </a>
      )
      : (
        <div
          class={`${tw`font-bold p-3 w-full ${marginLeft}`}`}
        >
          {file.label || "UNKNOWN"}
        </div>
      );
  }

  #getNavFiles(): Array<FileOptions> {
    return this.props.config.sourceFiles.filter((file) => {
      let valid = true;
      if (this.props.config.nav?.collapse) {
        if (this.#path === this.#pagePrefix) {
          valid = file.route === this.#pagePrefix ||
            file.routePrefix === this.#pagePrefix;
        } else {
          valid = file.route === this.#pagePrefix ||
            file.routePrefix === this.#pagePrefix ||
            file.route.startsWith(this.#path);
        }
      } else if (this.props.config.pages) {
        valid = file.route === this.#pagePrefix ||
          file.routePrefix.startsWith(this.#pagePrefix);
      }
      return valid;
    });
  }

  #getDropDownFiles(): Array<FileOptions> {
    if (!this.props.config.pagesDropdown || this.#pagePrefix === "/") {
      return [];
    }
    const prefix = this.props.config.pages ? this.#pagePrefix : "/";
    const pages: Array<FileOptions> = [];
    for (const file of this.props.config.sourceFiles) {
      if (
        file.routePrefix === prefix &&
        // file.route !== prefix &&
        !pages.find((f) => f.route === file.route)
      ) {
        pages.push(file);
      }
    }
    return pages.sort(sortByKey("route"));
  }
}
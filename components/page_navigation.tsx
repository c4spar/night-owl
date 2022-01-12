/** @jsx h */

import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { parseRoute, sortByKey } from "../lib/utils.ts";
import { ModuleSelection } from "./module_selection.tsx";
import { Navigation } from "./navigation.tsx";
import { Component, Fragment, h, log, tw } from "../deps.ts";

export interface PageNavigationOptions {
  config: AppConfig;
  file: SourceFile;
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
      this.props.file.versions?.all,
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

  #renderNavLink(file: SourceFile) {
    const hasDuplicateRoutes = this.props.config.sourceFiles.find(
      (f) => f !== file && f.route === file.route,
    );

    if (file.isDirectory && hasDuplicateRoutes) {
      file = hasDuplicateRoutes;
    } else if (!file.isDirectory && hasDuplicateRoutes) {
      return null;
    }

    const isRootFile = file.routePrefix === "/";
    const selected = this.#isSelected(file) ? "selected" : "";
    const bold = isRootFile || hasDuplicateRoutes || file.isDirectory
      ? "font-bold"
      : "";
    const rem = file.route.split("/").length - 1;
    const marginLeft = `pl-[${rem}rem]`;
    const css = `${selected} ${tw`p-3 w-full ${marginLeft} ${bold}`}`;

    return file.content || hasDuplicateRoutes
      ? <a class={css} href={file.route}>{file.label}</a>
      : <div class={css}>{file.label}</div>;
  }

  #getNavFiles(): Array<SourceFile> {
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

  #getDropDownFiles(): Array<SourceFile> {
    if (!this.props.config.pagesDropdown || this.#pagePrefix === "/") {
      return [];
    }
    const prefix = this.props.config.pages ? this.#pagePrefix : "/";
    const pages: Array<SourceFile> = [];
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

  #isSelected(file: SourceFile): boolean {
    return this.props.file === file;
  }
}

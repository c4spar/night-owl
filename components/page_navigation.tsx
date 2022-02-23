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
  #isDirectory: boolean;

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
    this.#isDirectory = this.props.file.isDirectory ||
      this.props.config.sourceFiles.some(
        (f) => f !== this.props.file && f.route === this.props.file.route,
      );
  }

  render() {
    const dropDownFiles = this.#getDropDownFiles();
    const navFiles = this.#getNavFiles();

    return (
      <Fragment>
        <ModuleSelection
          files={dropDownFiles}
          selected={this.#path}
        />
        <Navigation class="primary-nav">
          {navFiles.map((file, i) => this.#renderNavLink(file, i, navFiles))}
        </Navigation>
      </Fragment>
    );
  }

  #renderNavLink(file: SourceFile, i: number, files: Array<SourceFile>) {
    const duplicateRoute = this.props.config.sourceFiles.find(
      (f) => f.route === file.route && f.isDirectory != file.isDirectory,
    );

    if (duplicateRoute) {
      if (file.isDirectory) {
        file = duplicateRoute;
      } else {
        return null;
      }
    }

    const isDirectory = file.isDirectory || !!duplicateRoute;
    const isRootFile = file.routePrefix === "/";
    const isSelected = this.#isSelected(file);
    const isActive = this.#isActive(file);
    const isPrevActive = !!files[i - 1] && this.#isActive(files[i - 1]);
    const isNextActive = !!files[i + 1] && this.#isActive(files[i + 1]);
    const isFirstActive = isActive && !isPrevActive;
    const isLastActive = isActive && !isNextActive;

    const paddingLeft = file.route.split("/").length - 2;

    const css = `${tw`w-full pr-3 pl-[${paddingLeft}rem]`}
      ${isSelected ? "selected" : ""}
      ${isActive ? "active" : ""}
      ${isFirstActive ? "first" : ""}
      ${isLastActive ? "last" : ""}
      ${isDirectory ? "directory" : "file"}
      ${isRootFile ? "root" : ""}`;

    return file.content || duplicateRoute
      ? (
        <a class={css} href={file.route}>
          <div class={tw`${isLastActive ? "pt-3 mb-3" : "py-3"} pl-[1.25rem]`}>
            {file.name}
          </div>
        </a>
      )
      : (
        <div class={css}>
          <div class={tw`${isLastActive ? "pt-3 mb-3" : "py-3"} pl-[1.25rem]`}>
            {file.name}
          </div>
        </div>
      );
  }

  #getNavFiles(): Array<SourceFile> {
    return this.props.config.sourceFiles.filter((file, i, files) => {
      const hasDuplicateRoutes = files.some(
        (f) => f !== file && f.route === file.route,
      );
      if (hasDuplicateRoutes && !file.isDirectory) {
        return false;
      }

      let valid = true;
      if (this.props.config.nav?.collapse) {
        if (this.#path === this.#pagePrefix) {
          valid = file.route === this.#pagePrefix ||
            file.routePrefix === this.#pagePrefix;
        } else {
          valid = file.route === this.#pagePrefix ||
            file.routePrefix === this.#pagePrefix ||
            (
              file.route.startsWith(this.#path) &&
              this.props.file.route.startsWith(file.routePrefix)
            );
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

  #isActive(file: SourceFile): boolean {
    return file.route.startsWith(
      this.#isDirectory ? this.props.file.route : this.props.file.routePrefix,
    );
  }
}

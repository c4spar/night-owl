/** @jsx h */

import { AppConfig } from "../lib/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { parseRoute, sortByKey } from "../lib/utils.ts";
import { ModuleSelection } from "./module_selection.tsx";
import { Navigation } from "./navigation.tsx";
import { apply, Component, css, Fragment, h, log, tw } from "../deps.ts";
import { styles } from "../lib/styles.ts";
import { VersionSelection } from "./version_selection.tsx";

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
        <VersionSelection
          file={this.props.file}
          config={this.props.config}
          class={tw`xl:hidden`}
        />
        <Navigation class={`primary-nav ${tw`${this.#css()}`}`}>
          {navFiles.map((file, i) => this.#renderNavLink(file, i, navFiles))}
        </Navigation>
      </Fragment>
    );
  }

  #css() {
    return css({
      // item
      ".nav-item": styles.transform.primary,
      ".nav-item.active": styles.bg.secondary,
      ".nav-item.active.first": apply`rounded-t-xl`,
      ".nav-item.active.last": apply`rounded-b-xl`,
      // label
      ".nav-item .nav-item-label": apply
        `py-3 pl-5 pr-5 ${styles.text.primaryGradient}`,
      ".nav-item:first-child .nav-item-label": apply`pt-5`,
      ".nav-item:last-child .nav-item-label": apply`pb-5`,
      ".nav-item:hover .nav-item-label": styles.text.secondaryGradientAccent,
      ".nav-item.file:not(.nav-item.selected, .nav-item.root, .nav-item:hover) .nav-item-label":
        styles.text.secondaryGradient,
      ".nav-item.selected .nav-item-label": styles.text.secondaryGradientAccent,
      ".nav-item.active.last .nav-item-label": apply`pt-3 pb-0 mb-3`,
      ".nav-item.active.last:last-child .nav-item-label": apply`pb-0 mb-5`,
      ".nav-item.active:not(.root,.first) .nav-item-label": apply
        `border-l-2 border-blue(400 dark:400)`,
    });
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

    const paddingLeft = file.route.split("/").length - 1.5;

    const css = `${tw`
      ${styles.transform.primary}
      w-full pr-3
      pl-[${paddingLeft}rem]`}
      ${isSelected ? "selected" : ""}
      ${isActive ? "active" : ""}
      ${isFirstActive ? "first" : ""}
      ${isLastActive ? "last" : ""}
      ${isDirectory ? "directory" : "file"}
      ${isRootFile ? "root" : ""}`;

    return (
      <a
        class={`nav-item ${css}`}
        href={file.content || duplicateRoute ? file.route : null}
      >
        <div class="nav-item-label">
          {file.name}
        </div>
      </a>
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

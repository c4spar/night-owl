/** @jsx h */

import { Component, h, log, tw } from "../deps.ts";
import { AppConfig } from "../lib/config/config.ts";
import { SourceFile } from "../lib/source_file.ts";
import { styles } from "../lib/styles.ts";
import { getRouteRegex } from "../lib/utils.ts";
import { Link } from "./link.tsx";

export interface VersionWarningOptions {
  config: AppConfig;
  file?: SourceFile;
}

export class VersionWarning extends Component<VersionWarningOptions> {
  render() {
    log.debug("file: %O", this.props.file);
    return (
      <div
        class={tw`flex bg-yellow(300 dark:600) relative ${styles.transform.primary}`}
      >
        <div
          class={tw`
                max-w-8xl mx-auto px-4 sm:px-6 md:px-8 py-5
                text-red-800 text-lg font-primary font-bold justify-center text-center
              `}
        >
          ⚠️ You are viewing the documentation generated from a user contribution
          or an upcoming or past release.
          <br></br>
          <Link
            href={this.#getLatestVersionRoute()}
            class={tw`!text-blue-900 !hover:text-indigo-900 text-underline flex font-bold justify-center text-center ${styles.transform.primary}`}
          >
            Click here to view the documentation for the latest release.
          </Link>
        </div>
      </div>
    );
  }

  #getLatestVersionRoute() {
    if (!this.props.file?.versions) {
      return "";
    }
    const regex = getRouteRegex(
      this.props.file.versions.all,
      this.props.config.pages,
    );
    const replace = this.props.config.pages
      ? "$3@" + this.props.file.versions.latest + "$6$8"
      : "/" + this.props.file.versions.latest + "$5$7";

    return this.props.file.route.replace(
      regex,
      replace,
    ).replace(/\/+$/, "");
  }
}

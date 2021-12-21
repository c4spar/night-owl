/** @jsx h */

import { Routable } from "../../components/routable.tsx";
import { Route } from "../../components/route.tsx";
import { Router } from "../../components/router.tsx";
import { Fragment, h, Helmet, tw } from "../../deps.ts";
import { GithubVersions } from "../../lib/git.ts";
import { FileOptions } from "../../lib/resource.ts";
import { ModulePage } from "./module/module_page.tsx";
import { DocsPage } from "./docs_page.tsx";

export interface DocsRouterOptions {
  versions: GithubVersions;
  docs: Array<FileOptions>;
  modules: Array<FileOptions>;
  repository: string;
}

export class DocsRouter extends Routable<DocsRouterOptions> {
  render() {
    const versions = this.props.versions.versions
      .map((version) => version.replace(/\./g, "\."))
      .join("|");

    const versionPattern = versions.length > 1
      ? `/(${versions})$`
      : `/${versions}$`;
    const versionRegex = new RegExp(versionPattern);
    const selectedVersion = this.prefix.match(versionRegex)?.[1] ??
      this.props.versions.latest;

    const modulePath = this.props.modules.map((module) => module.routeName);

    return (
      <Fragment>
        <Helmet>
          <title>Cliffy - Documentation</title>
        </Helmet>

        {/* documentation router */}
        <Router url={this.url} prefix={this.prefix}>
          <Route path={["/"]}>
            <DocsPage modules={this.props.modules} />
          </Route>
          <Route path={modulePath} partialMatch>
            <ModulePage
              versions={this.props.versions}
              selectedVersion={selectedVersion}
              docs={this.props.docs}
              modules={this.props.modules}
              repository={this.props.repository}
            />
          </Route>
        </Router>
      </Fragment>
    );
  }
}

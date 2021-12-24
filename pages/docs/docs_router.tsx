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
  rev: string;
  selectedVersion: string;
}

export class DocsRouter extends Routable<DocsRouterOptions> {
  render() {
    const docsPath = this.props.modules.length > 0 ? ["/"] : [];
    const modulePath = this.props.modules.length > 0
      ? this.props.modules.map((module) => module.routeName)
      : ["/"];

    return (
      <Fragment>
        <Helmet>
          <title>Cliffy - Documentation</title>
        </Helmet>

        {/* documentation router */}
        <Router url={this.url} prefix={this.prefix}>
          <Route path={docsPath}>
            <DocsPage modules={this.props.modules} />
          </Route>
          <Route path={modulePath} partialMatch>
            <ModulePage
              versions={this.props.versions}
              selectedVersion={this.props.selectedVersion}
              docs={this.props.docs}
              modules={this.props.modules}
              repository={this.props.repository}
              rev={this.props.rev}
            />
          </Route>
        </Router>
      </Fragment>
    );
  }
}

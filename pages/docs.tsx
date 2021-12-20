/** @jsx h */

import { Page } from "../components/page.tsx";
import { Route } from "../components/route.tsx";
import { Router } from "../components/router.tsx";
import { Fragment, h, Helmet, tw } from "../deps.ts";
import { Module } from "../lib/config.ts";
import { FileOptions } from "../lib/resource.ts";
import { ModuleDocumentationPage } from "./docs/module/documentation.tsx";
import { GetStartedPage } from "./docs/get_started.tsx";

export interface DocsPageOptions {
  versions: Array<string>;
  docs: Array<FileOptions>;
  modules: Array<Module>;
  repository: string;
}

export class DocsPage extends Page<DocsPageOptions> {
  render() {
    const modulePath = this.props.modules.map((module) => `/${module.name}`);
    const selectedVersion = this.prefix.match(/\/(v[0-9][^\/]*)$/)?.[1] ??
      this.props.versions[0];

    return (
      <Fragment>
        <Helmet>
          <title>Cliffy - Documentation</title>
        </Helmet>

        {/* documentation router */}
        <Router url={this.url} prefix={this.prefix}>
          <Route path={["/", "/getting-started"]}>
            <GetStartedPage modules={this.props.modules} />
          </Route>
          <Route path={modulePath} partialMatch>
            <ModuleDocumentationPage
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

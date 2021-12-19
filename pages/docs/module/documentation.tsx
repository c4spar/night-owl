/** @jsx h */

import { Markdown } from "../../../components/markdown.tsx";
import { RouteNotFoundError } from "../../../components/router.tsx";
import { Sidebar } from "../../../components/sidebar.tsx.tsx";
import { VersionSelection } from "../../../components/version_selection.tsx";
import { Fragment, h, Helmet, tw } from "../../../deps.ts";
import { Page } from "../../../components/page.tsx";
import { FileOptions } from "../../../lib/resource.ts";
import { transformGpu } from "../../../lib/styles.ts";
import { DocumentationNavigation } from "./navigation.tsx";
import { SecondaryDocumentationNavigation } from "./secondary_navigation.tsx";

export interface ModuleDocumentationPageOptions {
  versions: Array<string>;
  selectedVersion: string;
  docs: Array<FileOptions>;
}

export class ModuleDocumentationPage extends Page<ModuleDocumentationPageOptions> {
  render() {
    const prefix = this.prefix.replace("/" + this.props.selectedVersion, "");
    const route = prefix + (this.path === "/" ? "/getting-started" : this.path);
    const file = this.props.docs.find((file) => file.route === route);
    const selectedModule = this.prefix.split("/").at(-1);

    if (!file) {
      throw new RouteNotFoundError();
    }

    // Add selected version to cliffy module imports.
    const docs = this.props.docs.filter((file: FileOptions) =>
      file.route.startsWith(prefix) && file.route !== prefix
    );

    // Add selected version to cliffy module imports.
    file.content = file.content
      .replace(
        /https:\/\/deno\.land\/x\/cliffy\//g,
        `https://deno.land/x/cliffy@${this.props.selectedVersion}/`,
      )
      .replace(
        /https:\/\/deno\.land\/x\/cliffy@<version>\//g,
        `https://deno.land/x/cliffy@${this.props.selectedVersion}/`,
      )
      .replace(
        /https:\/\/x\.nest\.land\/cliffy@<version>\//g,
        `https://x.nest.land/cliffy@${this.props.selectedVersion}/`,
      )
      .replace(
        /https:\/\/raw\.githubusercontent\.com\/c4spar\/deno-cliffy\/<version>\//g,
        `https://raw.githubusercontent.com/c4spar/deno-cliffy/${this.props.selectedVersion}/`,
      );

    return (
      <Fragment>
        {/* sidebar left */}
        <Sidebar position="left" class={tw`${transformGpu} hidden lg:block`}>
          <DocumentationNavigation docs={docs} prefix={this.prefix} />
        </Sidebar>

        {/* main */}
        <div class={tw`lg:pl-[19.5rem]`}>
          <div
            class={tw`max-w(3xl xl:none)
              mx-auto pt-10 xl:ml-0 xl:mr-[15.5rem] xl:pr-16`}
          >
            {/* content */}
            <main class={tw`${transformGpu} relative`}>
              <Markdown content={file.content} prefix={this.prefix} />
            </main>

            {/* sidebar right */}
            <Sidebar
              position="right"
              class={tw`${transformGpu} hidden xl:block`}
            >
              <VersionSelection
                class={tw`mb-3`}
                versions={this.props.versions}
                selectedVersion={this.props.selectedVersion}
              />
              <SecondaryDocumentationNavigation file={file} />
            </Sidebar>
          </div>
        </div>
      </Fragment>
    );
  }
}

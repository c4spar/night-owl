/** @jsx h */

import { EditPageOnGithub } from "../../../components/edit_page_on_github.tsx";
import { Markdown } from "../../../components/markdown.tsx";
import { ModuleSelection } from "../../../components/module_selection.tsx";
import { RouteNotFoundError } from "../../../components/router.tsx";
import { Sidebar } from "../../../components/sidebar.tsx.tsx";
import { VersionSelection } from "../../../components/version_selection.tsx";
import { Fragment, h, tw } from "../../../deps.ts";
import { Routable } from "../../../components/routable.tsx";
import { GithubVersions } from "../../../lib/git.ts";
import { FileOptions } from "../../../lib/resource.ts";
import { transformGpu } from "../../../lib/styles.ts";
import { joinUrl } from "../../../lib/utils.ts";
import { ModuleNavigation } from "./module_navigation.tsx";
import { SecondaryModuleNavigation } from "./module_secondary_navigation.tsx";

export interface ModulePageOptions {
  versions: GithubVersions;
  selectedVersion: string;
  docs: Array<FileOptions>;
  modules: Array<FileOptions>;
  repository: string;
}

export class ModulePage extends Routable<ModulePageOptions> {
  render() {
    const prefix = this.prefix.replace("/" + this.props.selectedVersion, "");

    // Get docs from current module.
    const docs = this.props.docs.filter((file: FileOptions) =>
      file.route.startsWith(prefix) && file.route !== prefix
    );

    if (!docs.length) {
      throw new RouteNotFoundError();
    }

    const route = joinUrl(
      prefix,
      this.path === "/" ? docs[0].routeName : this.path,
    );
    const file = docs.find((file) => file.route === route);
    const selectedModule = this.prefix.split("/").at(-1);

    if (!file) {
      throw new RouteNotFoundError();
    }

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
          <ModuleSelection
            class={tw`mb-3`}
            modules={this.props.modules}
            selectedModule={selectedModule}
          />
          <ModuleNavigation docs={docs} prefix={this.prefix} />
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
              <EditPageOnGithub
                path={file.path}
                repository={this.props.repository}
              />
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
              <SecondaryModuleNavigation file={file} />
            </Sidebar>
          </div>
        </div>
      </Fragment>
    );
  }
}

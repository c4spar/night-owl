/** @jsx h */

import { apply, Component, css, Fragment, h, Helmet, tw } from "../deps.ts";
import { colors } from "../lib/sheet.ts";
import { styles } from "../mod.ts";

export interface DocSearchConfig {
  appId: string;
  indexName: string;
  apiKey: string;
}

export interface DocSearchOptions {
  config: DocSearchConfig;
  class?: string;
}

export class DocSearch extends Component<DocSearchOptions> {
  render() {
    return (
      <Fragment>
        <Helmet>
          <style>{this.#css()}</style>
        </Helmet>
        <Helmet footer>
          <script type="application/javascript">
            {this.#getSearchScript()}
          </script>
        </Helmet>
        <div
          id="docsearch"
          class={`${this.props.class} ${tw`flex font-primary ${styles.text.accentPrimary} ${
            css({
              "*": styles.transform.primary,
              ".DocSearch-Button": apply`m-0`,
              ".DocSearch-Button-Keys": apply`mt-1`,
            })
          }`}`}
        >
        </div>
      </Fragment>
    );
  }

  #css() {
    return `
      :root {
        --docsearch-primary-color: ${colors.purple["600"]} !important;
        --docsearch-text-color: ${colors.blue["600"]} !important;
        --docsearch-muted-color: ${colors.blue["400"]} !important;
        --docsearch-hit-color: ${colors.blue["400"]} !important;
        --docsearch-logo-color: ${colors.blue["600"]} !important;
        --docsearch-hit-active-color: #FFF !important;

        --docsearch-modal-background: ${colors.gray["100"]} !important;
        --docsearch-searchbox-background: ${colors.white} !important;
        --docsearch-searchbox-focus-background: ${colors.white} !important;
        --docsearch-hit-background: ${colors.white} !important;
        --docsearch-footer-background: ${colors.white} !important;
      }

      html[data-theme=dark] {
        --docsearch-primary-color: ${colors.purple["600"]} !important;
        --docsearch-text-color: ${colors.blue["400"]} !important;
        --docsearch-muted-color: ${colors.blue["400"]} !important;
        --docsearch-hit-color: ${colors.blue["400"]} !important;
        --docsearch-logo-color: ${colors.gray["300"]} !important;

        --docsearch-modal-background: ${colors.gray["800"]} !important;
        --docsearch-searchbox-background: ${colors.gray["900"]} !important;
        --docsearch-searchbox-focus-background: ${
      colors.gray["900"]
    } !important;
        --docsearch-hit-background: ${colors.gray["900"]} !important;
        --docsearch-footer-background: ${colors.gray["900"]} !important;
      }
    `;
  }

  #getSearchScript() {
    const config = encodeURIComponent(
      JSON.stringify({
        contextualSearch: true,
        ...this.props.config,
        container: "#docsearch",
      }),
    );
    return `docsearch(JSON.parse(decodeURIComponent(${
      Deno.inspect(config)
    })));`;
  }
}

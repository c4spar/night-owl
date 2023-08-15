/** @jsx h */

import { SourceFile } from "../lib/resource/source_file.ts";
import { styles } from "../mod.ts";
import { Navigation } from "./navigation.tsx";
import {
  apply,
  Component,
  comrak,
  css,
  Fragment,
  h,
  Helmet,
  render,
  tw,
} from "../deps.ts";
import { pathToUrl } from "../lib/utils.ts";

export interface SecondaryPageNavigationOptions {
  file: SourceFile;
}

export class SecondaryPageNavigation
  extends Component<SecondaryPageNavigationOptions> {
  render() {
    const html = comrak.markdownToHTML(this.props.file.content);

    const headlines = html.match(/<h(1|2|3|4|5)>([^<]+)<\/h\1>/g)?.map(
      (h) => {
        const [_, size, name] = h.match(/<h(1|2|3|4|5)>([^<]+)<\/h\1>/) ?? [];
        return {
          size: Number(size),
          name,
          href: "#" +
            pathToUrl(name?.toLowerCase().replace(/[.?)(\/]+/g, "") ?? ""),
        };
      },
    );

    if (headlines) {
      const minSize = headlines.reduce(
        (prev, h) => h.size < prev ? h.size : prev,
        Infinity,
      ) ?? 0;

      for (const headline of headlines) {
        headline.size = headline.size - minSize + 1.25;
      }
    }

    return (
      <Fragment>
        <Helmet footer>
          <script type="application/javascript">{this.#getScript()}</script>
        </Helmet>
        <Navigation
          class={tw`p-2 rounded-xl ${styles.transform.primary} ${styles.bg.secondary} ${this.#css()}`}
        >
          {render(headlines?.map((headline) => {
            const padding = tw`py-3 pl-[${headline.size / 1.5 + 0.4}rem] pr-5`;
            const headlineStyle = headline.size === 1
              ? tw`${styles.text.primaryGradientAccent}`
              : tw`${styles.text.secondary}`;
            return (
              <a
                class={"nav-item " + tw`
                pl-4 ${headlineStyle}`}
                href={headline.href}
              >
                <div class={`nav-item-label ${padding}`}>
                  {headline.name}
                </div>
              </a>
            );
          }))}
        </Navigation>
      </Fragment>
    );
  }

  #css() {
    return css({
      ".nav-item .nav-item-label":
        apply`border-l-2 border-transparent ${styles.text.primaryGradient}`,
      ".nav-item:hover .nav-item-label": styles.text.secondaryGradientAccent,
      ".nav-item:not(.nav-item:first-child, .nav-item.active, .nav-item:hover) .nav-item-label":
        styles.text.secondaryGradient,
      ".nav-item.active .nav-item-label":
        apply`border-blue(400 dark:400) ${styles.text.secondaryGradientAccent}`,
      ".nav-item:first-child .nav-item-label":
        styles.text.primaryGradientAccent,
      ".nav-item.active:first-child .nav-item-label": apply`pt-0 mt-3`,
      ".nav-item.active:last-child .nav-item-label": apply`pb-0 mb-3`,
    });
  }

  #getScript() {
    return `
      const observer = new IntersectionObserver(handler, { rootMargin: "-200px 0px -100px 0px" });

      document.querySelectorAll("main section[id]").forEach((section) => {
        observer.observe(section);
      });

      function handler(entries) {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id").replace(/-section$/, "");
          const link = document.querySelector('nav a[href="#' + id + '"]');
          if (entry.intersectionRatio > 0) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    `;
  }
}

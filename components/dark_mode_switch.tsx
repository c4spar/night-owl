/** @jsx h */
import { Fragment, h, Helmet, tw } from "../deps.ts";
import { transformGpu } from "../lib/styles.ts";

export function DarkModeSwitch({ class: className }: { class?: string }) {
  return (
    <Fragment>
      <Helmet>
        <style>
          {`
          .toggle-button {
            transition: background-color 250ms, border-color 250ms, transform 500ms cubic-bezier(.26, 1.8, .46, .71);
          }
          .sun-icon-wrapper {
            transition: opacity 150ms, transform 500ms cubic-bezier(.26, 3, .46, .71);
          }
          .moon-icon-wrapper {
            transition: opacity 150ms, transform 500ms cubic-bezier(.26, 3, .46, .71);
          }
        `}
        </style>
      </Helmet>
      <Helmet footer>
        <script type="application/javascript" src="/iconify.min.js" />
        <script type="application/javascript">
          {`
          function toggleDarkMode() {
            if (document.documentElement.classList.contains("dark")) {
              document.documentElement.classList.remove("dark");
              localStorage.theme = "light";
            } else {
              document.documentElement.classList.add("dark");
              localStorage.theme = "dark";
            }
          }
        `}
        </script>
      </Helmet>
      <label class={className} onclick="toggleDarkMode()">
        <div
          class={`toggle-slot ${tw`
            ${transformGpu}
            cursor-pointer relative
            w-20 h-10 bg-gray-50 dark:bg-gray-700
            border-2 border-gray-300 dark:border-gray-600
            shadow-lg shadow-inner rounded-full`}`}
        >
          <div
            class={`sun-icon-wrapper ${tw`absolute h-6 w-6
              origin-center opacity-100 dark:opacity-0
              translate-x-[.6rem] dark:translate-x-[1rem] translate-y-[.35rem]
              rotate-[15deg] dark:rotate-0`}`}
          >
            <span
              class={`iconify ${tw`absolute h-6 w-6
                text-yellow-400 dark:text-gray-800`}`}
              data-icon="feather:sun"
            />
          </div>
          <div
            class={`toggle-button ${tw`absolute h-6 w-6 rounded-full
              bg-gray-300 dark:bg-gray-800 shadow
              translate-x-[2.9rem] dark:translate-x-[.4rem] translate-y-[.35rem]`}`}
          />
          <div
            class={`moon-icon-wrapper ${tw`absolute h-6 w-6
              origin-center opacity-0 dark:opacity-100
              translate-x-[2.2rem] dark:translate-x-[2.7rem] translate-y-[.35rem]
              rotate-0 dark:rotate-[-15deg]`}`}
          >
            <span
              class={`iconify ${tw`absolute h-6 w-6
               text-gray-800 dark:text-gray-50`}`}
              data-icon="feather:moon"
            />
          </div>
        </div>
      </label>
    </Fragment>
  );
}

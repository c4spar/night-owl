import { apply, css, theme } from "../deps.ts";

export const styles = {
  transform: {
    primary: apply`transform-colors duration-500 ease-out transform-gpu`,
  },
  bg: {
    primary: apply`bg-gray(50 dark:900)`,
    secondary: apply`bg(gray-100 dark:gray-800)`,
    accent: apply`bg(indigo-100 opacity-30 dark:(indigo-800 opacity-30))`,
  },
  text: {
    primary: apply`text-gray(700 dark:200)`,
    secondary: apply`text-gray(600 dark:300)`,
    accent: apply`text-purple(500 dark:400)`,
  },
};

const globalStyles = css({
  ":global": {
    "html": apply`min-h-full flex`,
    "body": apply
      `${styles.text.primary} ${styles.bg.primary} flex-1 w-full antialiased`,
  },
});

const headlines = css({
  "h1, h2, h3, h4, h5": css(
    apply`flex relative font-bold sm:truncate w-[fit-content]`,
    {
      "&:hover": {
        ".anchor-link": {
          "&::before": {
            visibility: "visible",
          },
        },
      },
    },
  ),
  "h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child":
    apply`mt-0`,
  "h1": apply`text-2xl leading-7 sm:text-3xl mb-5 mr-8 left-[-2rem]`,
  "h2": apply`text-xl leading-6 sm:text-2xl mb-4 mt-10 mr-7 left-[-1.75rem]`,
  "h3": apply`text-lg leading-5 sm:text-xl mb-3 mt-10 mr-6 left-[-1.5rem]`,
  "h4": apply`text-base leading-4 sm:text-lg mb-2 mt-10 mr-5 left-[-1.4rem]`,
  "h5": apply`text-sm leading-3 sm:text-base mb-1 mt-10 mr-4 left-[-1.35rem]`,
  ".anchor": apply`block relative -top-28 invisible`,
  "h1 .anchor-link::before": apply`text-xl sm:text-2xl`,
  "h2 .anchor-link::before": apply`text-lg sm:text-xl`,
  "h3 .anchor-link::before": apply`text-base sm:text-lg`,
  "h4 .anchor-link::before": apply`text-sm sm:text-base`,
  "h5 .anchor-link::before": apply`text-xs sm:text-sm`,
  ".anchor-link": {
    "&::before": {
      fontFamily: theme("fontFamily.awesome"),
      content: '"\\f0c1"',
      fontWeight: 900,
      marginRight: ".5rem",
      visibility: "hidden",
    },
  },
});

const links = css({
  "a:not(nav a,header a), a:not(nav a,header a) code": apply
    `text-blue(500 dark:400 hover:(600 dark:500))`,
  'a[href*="//"]': {
    "&::after": {
      fontFamily: theme("fontFamily.awesome"),
      color: theme("colors.blue.500"),
      fontSize: "0.7rem",
      content: '"\\f35d"',
      fontWeight: 900,
      position: "relative",
      marginLeft: "0.4rem",
      top: "-2px",
    },
  },
});

const nav = css({
  "nav a": apply`hover:text(blue-600 dark:white)`,
  "nav a.selected": apply`font-bold text-blue(500 dark:400)`,
  "nav": apply`${styles.transform.primary} `,
  "nav a.active": apply`${styles.transform.primary} ${styles.bg.secondary}`,
  "nav a.active.first": apply`rounded-t-xl`,
  "nav a.active.last": apply`rounded-b-xl`,
  "nav a.active.file:not(.root) div": apply
    `border-l-2 border-blue(400 dark:400)`,
  "nav a.root.file, nav a.directory": apply`font-bold`,
});

const paragraph = css({
  "p": apply`my-5`,
});

const list = css({
  "ul": apply`pl-4`,
  "ul:not(ul ul)": apply`my-5`,
  "ul, li > p": apply`m-0`,
});

const table = css({
  "table, th, td": apply
    `border-collapse border border-gray(300 dark:700) ${styles.transform.primary}`,
  "th, td": apply`py-2 px-3`,
  "tr": apply`even:bg-gray(100 dark:800) ${styles.transform.primary}`,
});

const images = css({
  "p img": apply`my-5`,
});

export const mainStyles = css(
  globalStyles,
  headlines,
  links,
  nav,
  paragraph,
  list,
  table,
  images,
);

export const syntaxHighlighting = css({
  ".language-console": apply`text-blue(500 dark:400)`,
  ".language-console .bash": styles.text.primary,
  ".code-comment": apply`text-gray(500 dark:400)`,
  ".code-property": apply`text-green(700 dark:300)`,
  ".code-function": apply`text-green(700 dark:300)`,
  ".code-literal": apply`text-cyan(600 dark:400) font-bold`,
  ".code-keyword": apply`text-purple(700 dark:400) font-italic`,
  ".code-operator": apply`text-purple(700 dark:400)`,
  ".code-variable.code-language": apply`text-purple(700 dark:400)`,
  ".code-number": apply`text-indigo(600 dark:400)`,
  ".code-doctag": apply`text-indigo(600 dark:400)`,
  ".code-regexp": apply`text-red(700 dark:300)`,
  ".code-meta, .code-string": apply`text-yellow(500 dark:200)`,
  ".code-meta": apply`font-bold`,
  ".code-type": apply`text-cyan(600 dark:400) font-italic`,
  ".code-built_in": apply`text-cyan(600 dark:400) font-italic`,
});

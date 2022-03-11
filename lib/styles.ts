import { apply, css, theme } from "../deps.ts";

export const styles = {
  transform: {
    primary: apply`transform-colors duration-500 ease-out transform-gpu`,
    secondary: apply`transform-colors duration-300 ease-out transform-gpu`,
  },
  bg: {
    primary: apply`bg-gray(50 dark:900)`,
    secondary: apply`bg-gray(100 dark:800)`,
    tertiary: apply`bg-gray(200 dark:700)`,
    accent: apply`bg(indigo-100 opacity-30 dark:(indigo-800 opacity-30))`,
  },
  text: {
    primary: apply`text-gray(700 dark:100)`,
    secondary: apply`text-gray(600 dark:400)`,
    accentPrimary: apply`text-blue(500 dark:400)`,
    accentSecondary: apply`text-purple(500 dark:400)`,
    primaryGradientAccent: apply
      `text-transparent bg-clip-text bg-gradient-to-br from(gray-700 dark:blue-400) to(gray-400 dark:purple-400)`,
    secondaryGradientAccent: apply
      `text-transparent bg-clip-text bg-gradient-to-br from(gray-700 dark:blue-400) to(gray-400 dark:blue-300)`,
    primaryGradient: apply
      `text-transparent bg-clip-text bg-gradient-to-br from(gray(700 dark:100)) to(gray(700 dark:100))`,
    secondaryGradient: apply
      `text-transparent bg-clip-text bg-gradient-to-br from(gray(600 dark:400)) to(gray(600 dark:400))`,
  },
  font: {
    primary: apply`font-primary`,
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
  "h1": apply
    `text-2xl leading-7 sm:text-3xl mb-5 mr-8 left-[-2rem] ${styles.text.primaryGradientAccent}`,
  "h2": apply
    `text-xl leading-6 sm:text-2xl mb-4 mt-10 mr-7 left-[-1.75rem] ${styles.text.secondaryGradientAccent}`,
  "h3": apply
    `text-lg leading-5 sm:text-xl mb-3 mt-10 mr-6 left-[-1.5rem] ${styles.text.secondaryGradientAccent}`,
  "h4": apply
    `text-base leading-4 sm:text-lg mb-2 mt-10 mr-5 left-[-1.4rem] ${styles.text.secondaryGradientAccent}`,
  "h5": apply
    `text-sm leading-3 sm:text-base mb-1 mt-10 mr-4 left-[-1.35rem] ${styles.text.secondaryGradientAccent}`,
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
});

const nav = css({
  "nav": apply`${styles.font.primary} font-bold`,
  "nav a:not(.selected)": apply`hover:text(blue-600 dark:gray-100)`,
});

export const mainStyles = css(
  globalStyles,
  headlines,
  nav,
  links,
);

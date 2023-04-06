import { apply, css } from "../deps.ts";

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
    primaryGradientAccent:
      apply`text-transparent bg-clip-text bg-gradient-to-br from(gray-700 dark:blue-400) to(gray-400 dark:purple-400)`,
    secondaryGradientAccent:
      apply`text-transparent bg-clip-text bg-gradient-to-br from(gray-700 dark:blue-400) to(gray-400 dark:blue-300)`,
    primaryGradient:
      apply`text-transparent bg-clip-text bg-gradient-to-br from(gray(700 dark:100)) to(gray(700 dark:100))`,
    secondaryGradient:
      apply`text-transparent bg-clip-text bg-gradient-to-br from(gray(600 dark:400)) to(gray(600 dark:400))`,
  },
  font: {
    primary: apply`font-primary`,
  },
};

const globalStyles = css({
  ":global": {
    "html": css(
      apply`min-h-full flex`,
      {
        "scroll-behavior": "smooth",
      },
    ),
    "body":
      apply`${styles.text.primary} ${styles.bg.primary} flex-1 w-full antialiased`,
  },
});

const headlines = css({
  "h1, h2, h3, h4, h5": apply`font-bold`,
  "h1":
    apply`text-2xl leading-7 sm:text-3xl ${styles.text.primaryGradientAccent}`,
  "h2":
    apply`text-xl leading-6 sm:text-2xl mb-4 ${styles.text.secondaryGradientAccent}`,
  "h3":
    apply`text-lg leading-5 sm:text-xl mb-3 ${styles.text.secondaryGradientAccent}`,
  "h4":
    apply`text-base leading-4 sm:text-lg ${styles.text.secondaryGradientAccent}`,
  "h5":
    apply`text-sm leading-3 sm:text-base ${styles.text.secondaryGradientAccent}`,
});

const links = css({
  "a:not(nav a,header a), a:not(nav a,header a) code":
    apply`text-blue(500 dark:400 hover:(600 dark:500))`,
});

export const mainStyles = css(
  globalStyles,
  headlines,
  links,
);

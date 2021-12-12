import { setup, twColors, virtualSheet } from "../deps.ts";

export const sheet = virtualSheet();

setup({
  sheet,
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      serif: [
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times, serif",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
      display: [
        "Fredoka One",
        "Varela Round",
        "Titan One",
      ],
      nerd: [
        "FiraCode Nerd Font",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: twColors.black,
      white: twColors.white,
      gray: twColors.coolGray,
      red: twColors.red,
      yellow: twColors.amber,
      green: twColors.emerald,
      cyan: twColors.cyan,
      blue: twColors.lightBlue,
      indigo: twColors.indigo,
      purple: twColors.fuchsia,
      pink: twColors.pink,
    },
    animation: {
      "left-right-heading": "left-right-heading .4s forwards",
      "left-right": "left-right .4s forwards",
      "top-bottom": "top-bottom .2s forwards",
      "slide-in": "slide-in .3s forwards",
      "fade-in": "fade-in .3s ease-out",
    },
    keyframes: {
      "left-right-heading": leftRight("18rem"),
      "left-right": leftRight("2rem"),
      "slide-in": {
        "0%": {
          transform: "translate(0, 200rem) scale(.5)",
        },
        "80%": {
          transform: "translate(0, 0) scale(.7)",
        },
        "100%": {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
      },
      "fade-in": {
        "0%": {
          opacity: 0,
        },
        "100%": {
          opacity: 1,
        },
      },
    },
  },
});

function leftRight(x: string) {
  return {
    "50%": {
      transform: `translate(${x}, 0) scale(.7)`,
      opacity: 1,
      color: twColors.purple["700"],
    },
    "60%": {
      color: twColors.indigo["700"],
    },
    "70%": {
      transform: "translate(0) scale(2)",
      opacity: 0,
    },
    "100%": {
      transform: "translate(0) scale(1)",
      opacity: 1,
    },
  };
}

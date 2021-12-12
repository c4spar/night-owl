import { setup, twColors, virtualSheet } from "../deps.ts";

export const sheet = virtualSheet();

setup({
  sheet,
  darkMode: "class",
  important: true,
  theme: {
    backgroundSize: {
      "4": "1rem",
    },
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
      display: ["Titan One"],
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
  },
});

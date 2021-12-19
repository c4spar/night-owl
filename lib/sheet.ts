import { setup, strict, twColors, virtualSheet } from "../deps.ts";

export const sheet = virtualSheet();

setup({
  sheet,
  darkMode: "class",
  mode: strict,
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem",
      },
      fontFamily: {
        display: ["Fredoka One"],
        nerd: ["FiraCode Nerd Font"],
        awesome: ["Font Awesome\\ 5 Free"],
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
        "bounce-right":
          "bounce-right 1s alternate cubic-bezier(.5,0,1,.5) infinite",
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
        "bounce-right": {
          from: {
            transform: "translate3d(0, 0, 0)",
          },
          to: {
            transform: "translate3d(.4rem, 0, 0)",
          },
        },
      },
    },
  },
  preflight: {
    // Import external stylesheet
    "@import": [
      // Font Awesome 5 Free
      "url('https://use.fontawesome.com/releases/v5.0.1/css/all.css')",
      // Fredoka One
      "url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Titan+One&family=Varela+Round&display=swap')",
      // FiraCode Nerd Font
      "url('https://mshaugh.github.io/nerdfont-webfonts/build/firacode-nerd-font.css')",
      // highlight.js theme: an-old-hope
      "url(https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/an-old-hope.min.css)",
    ],
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

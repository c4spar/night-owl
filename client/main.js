main();

function main() {
  if (isDarkModeEnabled()) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function isDarkModeEnabled() {
  return localStorage.theme === "dark" || (
    !localStorage.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

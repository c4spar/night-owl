# Night Owl

A simple in-memory site generator.

> ⚠️ This project is in very early development. There will likely be many
> breaking changes.

### Features

- No build-process.
- No static files.
- No extra CLI required.
- Support for markdown files and custom jsx components.
- Versions dropdown.
- Serve files from any repository.
- Dark & Light mode.
- "Edit this page on Github" links.

### Examples

#### Deno manual

This example serves the official deno manual directly from the Github
repository.

```ts
import { serve } from "https://raw.githubusercontent.com/c4spar/night-owl/v0.1.4/mod.ts";

await serve({
  src: "denoland/manual@main:/",
  nav: {
    collapse: true,
  },
});
```

```console
$ deno run --allow-env --allow-net https://raw.githubusercontent.com/c4spar/night-owl/v0.1.4/examples/deno_manual.ts
Listening on http://localhost:8000
```

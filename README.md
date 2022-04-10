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
import { serve } from "https://deno.land/x/night_owl@v0.1.21/mod.ts";

await serve({
  src: "denoland/manual@main:/",
  nav: {
    collapse: true,
  },
});
```

```console
$ GITHUB_TOKEN=****** deno run --allow-env --allow-net https://deno.land/x/night_owl@v0.1.21/examples/deno_manual.ts
Listening on http://localhost:8000
```

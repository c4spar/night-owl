# Nano Deploy

A simple in-memory site generator.

### Features

- No build-process.
- No static files.
- Supports markdown files and custom jsx components.
- Versioning support (based on git tags & protected branches).
- Serve files from any repository, even multiple repositories are supported.
- Dark & Light mode.
- Build in caching.
- Show "Edit this page on Github" links.
- Works with Deno Deploy.

### Examples

#### Deno manual

This example serves the official deno manual directly from the Github
repository.

```ts
import { serve } from "https://deno.land/x/nano_deploy/mod.ts";

await serve({
  src: "denoland/manual@main:/",
  nav: {
    collapse: true,
  },
});
```

```console
$ deno run --allow-env --allow-net -r https://raw.githubusercontent.com/c4spar/nano-deploy/main/examples/deno_manual.ts
Listening on http://localhost:8000
```

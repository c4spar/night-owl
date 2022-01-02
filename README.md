# Nano Deploy

A simple in-memory static site generator.

### Features

- No build process.
- Supports markdown files and custom jsx page components.
- Versioning support (based on git tags & protected branches).
- Serve files from any repository.
- Build in caching.
- Show "Edit this page on Github" links.
- Works with Deno Deploy.

### Examples

#### Deno manual

This example serve the official deno manual directly from the Github repository.

```ts
import { serve } from "https://deno.land/x/nano_deploy/mod.ts";

await serve({
  repository: "denoland/manual",
  src: "denoland/manual@main:/",
});
```

```console
$ deno run --allow-env --allow-net -r https://raw.githubusercontent.com/c4spar/nano-deploy/main/examples/deno_manual.ts
```

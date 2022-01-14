# [v0.0.6](https://github.com/c4spar/nano-deploy/compare/v0.0.5...v0.0.6) (Jan 15, 2022)

### Features

- add support for table of content file
  ([52343ae](https://github.com/c4spar/nano-deploy/commit/52343ae))
- design update
  ([b7f4a53](https://github.com/c4spar/nano-deploy/commit/b7f4a53))
- add Code component for inline code blocks
  ([474cd11](https://github.com/c4spar/nano-deploy/commit/474cd11))
- add port and hostname options
  ([7bc614e](https://github.com/c4spar/nano-deploy/commit/7bc614e))
- add scripts option
  ([08c26c8](https://github.com/c4spar/nano-deploy/commit/08c26c8))
- add theme option
  ([a971e3c](https://github.com/c4spar/nano-deploy/commit/a971e3c))
- add margin option to Code component and fix background transform
  ([3fde674](https://github.com/c4spar/nano-deploy/commit/3fde674))
- make loading of versions configurable
  ([cee100a](https://github.com/c4spar/nano-deploy/commit/cee100a))
- add sanitize option
  ([568d5b9](https://github.com/c4spar/nano-deploy/commit/568d5b9))
- allow src to be an SourceFilesOptions object and add prefix src option
  ([8b66f16](https://github.com/c4spar/nano-deploy/commit/8b66f16))

### Bug Fixes

- fix page dropdown
  ([4ed6f3d](https://github.com/c4spar/nano-deploy/commit/4ed6f3d))
- fix route prefix of folders with an index file
  ([5792724](https://github.com/c4spar/nano-deploy/commit/5792724))
- fix versions option
  ([cf4e7af](https://github.com/c4spar/nano-deploy/commit/cf4e7af))
- link github links to repository from selected page
  ([df596b8](https://github.com/c4spar/nano-deploy/commit/df596b8))
- fix log handler
  ([0c6bf5d](https://github.com/c4spar/nano-deploy/commit/0c6bf5d))
- fix getFiles pattern
  ([6e16325](https://github.com/c4spar/nano-deploy/commit/6e16325))

### Code Refactoring

- change text color of selected nav links to blue
  ([f9be5a5](https://github.com/c4spar/nano-deploy/commit/f9be5a5))
- rename Code component to CodeBlock
  ([1c71ea4](https://github.com/c4spar/nano-deploy/commit/1c71ea4))
- add toJson method to SourceFile and Asset class
  ([2c1144d](https://github.com/c4spar/nano-deploy/commit/2c1144d))
- refactor page background
  ([2337789](https://github.com/c4spar/nano-deploy/commit/2337789))
- make repository option optional
  ([fd9ce03](https://github.com/c4spar/nano-deploy/commit/fd9ce03))
- refactor external scripts and stylesheets
  ([b88e2c3](https://github.com/c4spar/nano-deploy/commit/b88e2c3))
- replace highlight.js with lowlight
  ([eadd523](https://github.com/c4spar/nano-deploy/commit/eadd523))
- implement SourceFile and Asset class
  ([681b199](https://github.com/c4spar/nano-deploy/commit/681b199))
- remove cacheKey option
  ([c21fe62](https://github.com/c4spar/nano-deploy/commit/c21fe62))
- link versions to files
  ([7405627](https://github.com/c4spar/nano-deploy/commit/7405627))
- throw an error if a file was not found on github
  ([9191f25](https://github.com/c4spar/nano-deploy/commit/9191f25))
- remove map option from getFiles
  ([d182d00](https://github.com/c4spar/nano-deploy/commit/d182d00))

### Chore

- fmt deps.ts ([ab39368](https://github.com/c4spar/nano-deploy/commit/ab39368))
- cleanup makefile
  ([ef3fbc7](https://github.com/c4spar/nano-deploy/commit/ef3fbc7))

# [v0.0.5](https://github.com/c4spar/nano-deploy/compare/v0.0.4...v0.0.5) (Jan 6, 2022)

### Features

- add support for raw.githubusercontent.com and github.com url's in options.src
  ([6ab9fa7](https://github.com/c4spar/nano-deploy/commit/6ab9fa7))
- add support for file url's
  ([735f20a](https://github.com/c4spar/nano-deploy/commit/735f20a))

### Code Refactoring

- remove prefix from ReadDirOptions and CreateFileOptions
  ([1d76d57](https://github.com/c4spar/nano-deploy/commit/1d76d57))

# [v0.0.4](https://github.com/c4spar/nano-deploy/compare/v0.0.3...v0.0.4) (Jan 6, 2022)

### Bug Fixes

- dynamic import of remote custom components not working
  ([be5b006](https://github.com/c4spar/nano-deploy/commit/be5b006))

# [v0.0.3](https://github.com/c4spar/nano-deploy/compare/v0.0.2...v0.0.3) (Jan 5, 2022)

### Bug Fixes

- add protocol to import path
  ([f415b3e](https://github.com/c4spar/nano-deploy/commit/f415b3e))

# [v0.0.2](https://github.com/c4spar/nano-deploy/compare/v0.0.1...v0.0.2) (Jan 4, 2022)

### Chore

- **upgrade:** deno/std v0.119.0
  ([199c64d](https://github.com/c4spar/nano-deploy/commit/199c64d))

# [v0.0.1](https://github.com/c4spar/nano-deploy/compare/8bca0ba...v0.0.1) (Jan 4, 2022)

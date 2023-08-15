# [v0.1.26](https://github.com/c4spar/night-owl/compare/v0.1.25...v0.1.26) (Aug 15, 2023)

### Bug Fixes

- **fs:** fix toc file loading and some refactorings (#6)
  ([31331a5](https://github.com/c4spar/night-owl/commit/31331a5))

### Code Refactoring

- **fs:** refactor readDir & readSourceFiles methods (#5)
  ([1f428bd](https://github.com/c4spar/night-owl/commit/1f428bd))

### Chore

- **upgrade:** deno/std@v0.198.0 (#4)
  ([85f84c0](https://github.com/c4spar/night-owl/commit/85f84c0))

# [v0.1.25](https://github.com/c4spar/night-owl/compare/v0.1.24...v0.1.25) (Aug 14, 2023)

### Code Refactoring

- group fs methods and fix some bugs (#3)
  ([8b6d556](https://github.com/c4spar/night-owl/commit/8b6d556))
- refactor createConfig method
  ([03f6f62](https://github.com/c4spar/night-owl/commit/03f6f62))

# [v0.1.24](https://github.com/c4spar/night-owl/compare/v0.1.23...v0.1.24) (Apr 6, 2023)

### Chore

- **upgrade:** deno/std@v0.182.0
  ([b29d282](https://github.com/c4spar/night-owl/commit/b29d282))

# [v0.1.23](https://github.com/c4spar/night-owl/compare/v0.1.22...v0.1.23) (Sep 3, 2022)

### Bug Fixes

- don't copy `$` symbol with copy button
  ([b3a7287](https://github.com/c4spar/night-owl/commit/b3a7287))

# [v0.1.22](https://github.com/c4spar/night-owl/compare/v0.1.21...v0.1.22) (Aug 26, 2022)

### Bug Fixes

- sort versions by semver
  ([a906d11](https://github.com/c4spar/night-owl/commit/a906d11))

### Chore

- **upgrade:** deno/std@v0.153.0
  ([e10a1b2](https://github.com/c4spar/night-owl/commit/e10a1b2))

# [v0.1.21](https://github.com/c4spar/nano-page/compare/v0.1.20...v0.1.21) (Apr 10, 2022)

### Features

- add `pattern` option to src options
  ([b7d00cd](https://github.com/c4spar/nano-page/commit/b7d00cd))

### Code Refactoring

- redirect to home on webhooks/cache/clear
  ([b7fba5f](https://github.com/c4spar/nano-page/commit/b7fba5f))
- move search button in navbar to the right
  ([18f6c6c](https://github.com/c4spar/nano-page/commit/18f6c6c))

# [v0.1.20](https://github.com/c4spar/nano-page/compare/v0.1.19...v0.1.20) (Apr 6, 2022)

### Bug Fixes

- use main repo for github link in header nav
  ([4644f6c](https://github.com/c4spar/nano-page/commit/4644f6c))

# [v0.1.19](https://github.com/c4spar/nano-page/compare/v0.1.18...v0.1.19) (Apr 5, 2022)

### Bug Fixes

- fix env util method
  ([df0c432](https://github.com/c4spar/nano-page/commit/df0c432))

### Code Refactoring

- remove unused script
  ([0010b11](https://github.com/c4spar/nano-page/commit/0010b11))
- load docsearch script directly
  ([c383771](https://github.com/c4spar/nano-page/commit/c383771))
- add overloads to env method
  ([7aa106e](https://github.com/c4spar/nano-page/commit/7aa106e))

### Documentation Updates

- update readme ([6e955a7](https://github.com/c4spar/nano-page/commit/6e955a7))

# [v0.1.18](https://github.com/c4spar/nano-page/compare/v0.1.17...v0.1.18) (Apr 5, 2022)

### Features

- **search:** implement docsearch
  ([09adab2](https://github.com/c4spar/nano-page/commit/09adab2))

### Bug Fixes

- dark mode is applied to late
  ([e465cdc](https://github.com/c4spar/nano-page/commit/e465cdc))
- add workaround for animated text in chrome
  ([9851c0a](https://github.com/c4spar/nano-page/commit/9851c0a))
- nav button is behind navigation
  ([125fdf2](https://github.com/c4spar/nano-page/commit/125fdf2))
- navigation is not correctly positioned
  ([003e842](https://github.com/c4spar/nano-page/commit/003e842))

### Code Refactoring

- move app component into component folder
  ([ac73d09](https://github.com/c4spar/nano-page/commit/ac73d09))
- refactor header nav links
  ([24194f8](https://github.com/c4spar/nano-page/commit/24194f8))

# [v0.1.17](https://github.com/c4spar/nano-page/compare/v0.1.16...v0.1.17) (Mar 13, 2022)

### Bug Fixes

- add missing VersionWarning component
  ([baa337a](https://github.com/c4spar/nano-page/commit/baa337a))

# [v0.1.16](https://github.com/c4spar/nano-page/compare/v0.1.15...v0.1.16) (Mar 13, 2022)

### Features

- redirect to the latest version if no version is specified in url
  ([60a7bd3](https://github.com/c4spar/nano-page/commit/60a7bd3))
- show warning if a none released version is selected
  ([53ef9fd](https://github.com/c4spar/nano-page/commit/53ef9fd))
- add webhook endpoint to clear the cache
  ([357442b](https://github.com/c4spar/nano-page/commit/357442b))
- add copy button to CodeBlock component
  ([5ad4ab1](https://github.com/c4spar/nano-page/commit/5ad4ab1))

### Bug Fixes

- typo in error message
  ([ef5d1da](https://github.com/c4spar/nano-page/commit/ef5d1da))

### Code Refactoring

- refactor serve and request methods
  ([ec70c63](https://github.com/c4spar/nano-page/commit/ec70c63))
- lowercase routes
  ([0a164b1](https://github.com/c4spar/nano-page/commit/0a164b1))

# [v0.1.15](https://github.com/c4spar/nano-page/compare/v0.1.14...v0.1.15) (Mar 12, 2022)

### Features

- show version dropdown in main sidebar on mobile view
  ([dad0531](https://github.com/c4spar/nano-page/commit/dad0531))
- highlight visible sections in secondary navbar
  ([5261d0c](https://github.com/c4spar/nano-page/commit/5261d0c))
- add new infobox
  ([26284e2](https://github.com/c4spar/nano-page/commit/26284e2))
- add new dropdown component
  ([b0f64a6](https://github.com/c4spar/nano-page/commit/b0f64a6))

### Code Refactoring

- add border to dropdown items and remove unused code
  ([e9646a3](https://github.com/c4spar/nano-page/commit/e9646a3))
- rename ModuleSelection component to ModuleDropdown
  ([32310c5](https://github.com/c4spar/nano-page/commit/32310c5))
- rename VersionSelection component to VersionDropdown
  ([81c7014](https://github.com/c4spar/nano-page/commit/81c7014))
- rename selection to dropdown
  ([6a7b446](https://github.com/c4spar/nano-page/commit/6a7b446))
- refactor padding in navigations
  ([129948a](https://github.com/c4spar/nano-page/commit/129948a))
- refactor dropdown styles
  ([3c8e388](https://github.com/c4spar/nano-page/commit/3c8e388))
- refactor markdown styles
  ([69a804e](https://github.com/c4spar/nano-page/commit/69a804e))
- enable smooth scroll behavior
  ([0253905](https://github.com/c4spar/nano-page/commit/0253905))
- refactor navigation styles
  ([3f69d45](https://github.com/c4spar/nano-page/commit/3f69d45))
- add gradient colors to headlines
  ([df0edcf](https://github.com/c4spar/nano-page/commit/df0edcf))

### Chore

- **lint:** remove unused import
  ([82e2414](https://github.com/c4spar/nano-page/commit/82e2414))

# [v0.1.14](https://github.com/c4spar/nano-page/compare/v0.1.13...v0.1.14) (Mar 9, 2022)

### Bug Fixes

- add missing icon and button components
  ([285ffce](https://github.com/c4spar/nano-page/commit/285ffce))

# [v0.1.13](https://github.com/c4spar/nano-page/compare/v0.1.12...v0.1.13) (Mar 9, 2022)

### Features

- add support for static assets
  ([ef0aba1](https://github.com/c4spar/nano-page/commit/ef0aba1))
- add primary font
  ([4754fee](https://github.com/c4spar/nano-page/commit/4754fee))
- add navigation button for mobile view
  ([50ab859](https://github.com/c4spar/nano-page/commit/50ab859))

### Bug Fixes

- type attribute missing in stylesheets
  ([67a4d95](https://github.com/c4spar/nano-page/commit/67a4d95))
- index file not correctly matched
  ([58bd042](https://github.com/c4spar/nano-page/commit/58bd042))

### Code Refactoring

- add background color on hover to next and previous buttons
  ([c59dc8e](https://github.com/c4spar/nano-page/commit/c59dc8e))
- update NotFound component
  ([e302612](https://github.com/c4spar/nano-page/commit/e302612))
- update styles ([ff14f77](https://github.com/c4spar/nano-page/commit/ff14f77))
- remove external link icon from nav links
  ([258a086](https://github.com/c4spar/nano-page/commit/258a086))

# [v0.1.12](https://github.com/c4spar/nano-page/compare/v0.1.11...v0.1.12) (Mar 1, 2022)

### Features

- use github icon
  ([dac3fef](https://github.com/c4spar/nano-page/commit/dac3fef))

### Bug Fixes

- remove fix header height
  ([e8d1141](https://github.com/c4spar/nano-page/commit/e8d1141))
- don't default to main repository for source files
  ([c0e7f51](https://github.com/c4spar/nano-page/commit/c0e7f51))

# [v0.1.11](https://github.com/c4spar/nano-page/compare/v0.1.10...v0.1.11) (Mar 1, 2022)

### Bug Fixes

- index files mismatch
  ([1b6259c](https://github.com/c4spar/nano-page/commit/1b6259c))

# [v0.1.10](https://github.com/c4spar/nano-page/compare/v0.1.9...v0.1.10) (Feb 28, 2022)

### Bug Fixes

- toc file not working with static components
  ([2f37000](https://github.com/c4spar/nano-page/commit/2f37000))

# [v0.1.9](https://github.com/c4spar/nano-page/compare/v0.1.8...v0.1.9) (Feb 28, 2022)

### Bug Fixes

- fix toc file index
  ([61d288c](https://github.com/c4spar/nano-page/commit/61d288c))

# [v0.1.8](https://github.com/c4spar/nano-page/compare/v0.1.7...v0.1.8) (Feb 28, 2022)

### Bug Fixes

- toc file is always fetched from main
  ([fdb30cc](https://github.com/c4spar/nano-page/commit/fdb30cc))

### Documentation Updates

- fix example ([bc7f5ee](https://github.com/c4spar/nano-page/commit/bc7f5ee))

# [v0.1.7](https://github.com/c4spar/nano-page/compare/v0.1.6...v0.1.7) (Feb 28, 2022)

### Features

- add support for static component imports
  ([db35707](https://github.com/c4spar/nano-page/commit/db35707))

### Bug Fixes

- filter duplicate header links
  ([7643e93](https://github.com/c4spar/nano-page/commit/7643e93))

# [v0.1.6](https://github.com/c4spar/nano-page/compare/v0.1.5...v0.1.6) (Feb 27, 2022)

### Bug Fixes

- Deno.permissions is undefined in deploy
  ([71a54f0](https://github.com/c4spar/nano-page/commit/71a54f0))

# [v0.1.5](https://github.com/c4spar/nano-page/compare/v0.1.4...v0.1.5) (Feb 27, 2022)

### Bug Fixes

- exclude README.md if index.md exists
  ([58b2ab0](https://github.com/c4spar/nano-page/commit/58b2ab0))
- fix default site name
  ([8f7d619](https://github.com/c4spar/nano-page/commit/8f7d619))

### Code Refactoring

- return 404 on favicon temporarily
  ([2d944d6](https://github.com/c4spar/nano-page/commit/2d944d6))

### Documentation Updates

- add GITHUB_TOKEN to example
  ([abde19e](https://github.com/c4spar/nano-page/commit/abde19e))
- update readme ([6a59876](https://github.com/c4spar/nano-page/commit/6a59876))

# [v0.1.4](https://github.com/c4spar/nano-page/compare/v0.1.3...v0.1.4) (Feb 27, 2022)

### Features

- add label option to source file options
  ([766b00d](https://github.com/c4spar/nano-page/commit/766b00d))

### Bug Fixes

- versioned routes not working with toc file
  ([06d774f](https://github.com/c4spar/nano-page/commit/06d774f))
- git always fetches the latest version
  ([28d4847](https://github.com/c4spar/nano-page/commit/28d4847))
- apply prefix to all paths from toc file
  ([6bd8479](https://github.com/c4spar/nano-page/commit/6bd8479))

### Chore

- update Makefile
  ([84dba04](https://github.com/c4spar/nano-page/commit/84dba04))

### Documentation Updates

- update readme ([ba643eb](https://github.com/c4spar/nano-page/commit/ba643eb),
  [bec6e52](https://github.com/c4spar/nano-page/commit/bec6e52))
- update example ([58e3284](https://github.com/c4spar/nano-page/commit/58e3284))
- fix type in readme
  ([80aabc7](https://github.com/c4spar/nano-page/commit/80aabc7))
- update examples
  ([f985c16](https://github.com/c4spar/nano-page/commit/f985c16))

# [v0.1.3](https://github.com/c4spar/nano-deploy/compare/v0.1.2...v0.1.3) (Feb 25, 2022)

### Bug Fixes

- fix version mismatch
  ([60740e5](https://github.com/c4spar/nano-deploy/commit/60740e5))

# [v0.1.2](https://github.com/c4spar/nano-deploy/compare/v0.1.1...v0.1.2) (Feb 25, 2022)

### Bug Fixes

- **markdown:** fix special chars in url hash
  ([cadee28](https://github.com/c4spar/nano-deploy/commit/cadee28))
- **markdown:** add margin to blockquote
  ([890faf6](https://github.com/c4spar/nano-deploy/commit/890faf6))

### Chore

- **upgrade:** upgrade deps & deno/std to v0.127.0
  ([fc82842](https://github.com/c4spar/nano-deploy/commit/fc82842))

### Documentation Updates

- update readme
  ([2e5ff15](https://github.com/c4spar/nano-deploy/commit/2e5ff15))

# [v0.1.1](https://github.com/c4spar/nano-deploy/compare/v0.1.0...v0.1.1) (Feb 24, 2022)

### Features

- **markdown:** add blockquote markdown styles
  ([91f5be1](https://github.com/c4spar/nano-deploy/commit/91f5be1))
- **markdown:** add support for hash links
  ([cf7a660](https://github.com/c4spar/nano-deploy/commit/cf7a660))

### Bug Fixes

- **navigation:** fix nested nav items
  ([d740764](https://github.com/c4spar/nano-deploy/commit/d740764))
- **toc:** fix toc file regex
  ([890f4b8](https://github.com/c4spar/nano-deploy/commit/890f4b8))
- **markdown:** fix markdown link regex
  ([1389086](https://github.com/c4spar/nano-deploy/commit/1389086))
- **markdown:** fix links for remote markdown files
  ([ca1c080](https://github.com/c4spar/nano-deploy/commit/ca1c080))
- **markdown:** fix wrong markdown links
  ([c5c36b0](https://github.com/c4spar/nano-deploy/commit/c5c36b0))

### Code Refactoring

- refactor caching
  ([94a7574](https://github.com/c4spar/nano-deploy/commit/94a7574))
- refactor pathToUrl
  ([b2e1462](https://github.com/c4spar/nano-deploy/commit/b2e1462))

# [v0.1.0](https://github.com/c4spar/nano-deploy/compare/v0.0.7...v0.1.0) (Jan 16, 2022)

### Features

- add prev and next page links
  ([131f719](https://github.com/c4spar/nano-deploy/commit/131f719))

### Bug Fixes

- prev & next link not working correctly
  ([22878e2](https://github.com/c4spar/nano-deploy/commit/22878e2))
- fix margin in secondary sidebar
  ([4972340](https://github.com/c4spar/nano-deploy/commit/4972340))
- remove padding from first headlines and add styles for p and ul tags
  ([9ff810e](https://github.com/c4spar/nano-deploy/commit/9ff810e))
- fix headline with
  ([be5c4eb](https://github.com/c4spar/nano-deploy/commit/be5c4eb))
- miing source files with toc
  ([a9c766e](https://github.com/c4spar/nano-deploy/commit/a9c766e))
- fallback to first file from toc if no index route is present in the toc file
  ([9b4d276](https://github.com/c4spar/nano-deploy/commit/9b4d276))
- fix links in secondary sidebar and missing styles for h4 & h5
  ([723ef63](https://github.com/c4spar/nano-deploy/commit/723ef63))
- fallback to plain text for unknown languages in code block component
  ([bf60354](https://github.com/c4spar/nano-deploy/commit/bf60354))
- fix headlines in secondary page sidebar
  ([106aff4](https://github.com/c4spar/nano-deploy/commit/106aff4))
- **toc:** support routes without / as prefix in toc file and fix nested route
  prefix ([917ab94](https://github.com/c4spar/nano-deploy/commit/917ab94))

### Code Refactoring

- rename SourceFile.label to SourceFile.name
  ([eb63b56](https://github.com/c4spar/nano-deploy/commit/eb63b56))
- rename label option to name
  ([7559089](https://github.com/c4spar/nano-deploy/commit/7559089))
- make env variables optional
  ([fcce82c](https://github.com/c4spar/nano-deploy/commit/fcce82c))
- add table styles
  ([11229a4](https://github.com/c4spar/nano-deploy/commit/11229a4))
- update list styles
  ([465e9f0](https://github.com/c4spar/nano-deploy/commit/465e9f0))

### Chore

- **ci:** add lint workflow
  ([6c0c93b](https://github.com/c4spar/nano-deploy/commit/6c0c93b))

### Documentation Updates

- update readme
  ([42304ca](https://github.com/c4spar/nano-deploy/commit/42304ca))

# [v0.0.7](https://github.com/c4spar/nano-deploy/compare/v0.0.6...v0.0.7) (Jan 15, 2022)

### Bug Fixes

- catch not found error when fetching git tags and branches
  ([d99e3c5](https://github.com/c4spar/nano-deploy/commit/d99e3c5))

### Chore

- **upgrade:** deno/std v0.121.0
  ([846e12e](https://github.com/c4spar/nano-deploy/commit/846e12e))

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

.DEFAULT_GOAL := serve

include .env
export

lint:
	deno lint
fmt:
	deno fmt
serve:
	deno run --watch=. --allow-env --allow-net examples/cliffy_manual.ts
serve-deno:
	deno run --watch=. --allow-env --allow-net examples/deno_manual.ts
serve-provider:
	deno run --watch=. --allow-env --allow-net --allow-read examples/provider/main.ts
serve-multi:
	deno run --watch=. --allow-env --allow-net examples/multiple_sources.ts

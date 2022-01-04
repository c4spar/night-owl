.DEFAULT_GOAL := example-deno-manual

include .env
export

run: export NO_CACHE=false
run: export LOG_LEVEL=DEBUG

lint:
	deno lint
fmt:
	deno fmt
example-deno-manual:
	deno run --watch --allow-all examples/deno_manual.ts
example-provider:
	deno run --watch --allow-all examples/provider/main.ts

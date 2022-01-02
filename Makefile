.DEFAULT_GOAL := run

include .env
export

run: export NO_CACHE=false
run: export LOG_LEVEL=DEBUG

lint:
	deno lint
fmt:
	deno fmt
deno-manual:
	deno run --watch --allow-all examples/deno_manual.ts

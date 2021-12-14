.DEFAULT_GOAL := run

run: export NO_CACHE=true

lint:
	deno lint --ignore=data
	deno fmt --check --ignore=data
fmt:
	deno fmt --ignore=data
run:
	deno run --watch --allow-env=NO_CACHE --allow-net=:8000,code.iconify.design,cdnjs.cloudflare.com,fonts.googleapis.com,mshaugh.github.io --allow-read=data,examples,client main.tsx

.DEFAULT_GOAL := run

include .env
export

run: export NO_CACHE=true

lint:
	deno lint --ignore=data
	deno fmt --check --ignore=data
fmt:
	deno fmt --ignore=data
run:
	deno run --watch \
			--allow-env=NO_CACHE,GITHUB_TOKEN \
			--allow-net=:8000,code.iconify.design,cdnjs.cloudflare.com,fonts.googleapis.com,mshaugh.github.io,api.github.com \
			--allow-read=client,data,docs,examples \
			 main.tsx

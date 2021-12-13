.DEFAULT_GOAL := run

lint:
	deno lint --ignore=data
	deno fmt --check --ignore=data
fmt:
	deno fmt --ignore=data
run:
	deno run --watch --allow-net=:8000 --allow-read=data,examples,client main.tsx

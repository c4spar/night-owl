/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, Fragment, Helmet, serve } from "./deps.ts";
import { ssr } from "./ssr.tsx";
import { capitalize, stringToColor } from "./utils.ts";

interface BenchResult {
  totalMs: number;
  runsCount: number;
  measuredRunsAvgMs: number;
  rev: string;
  timestamp: number;
  version: typeof Deno.version;
}

interface TestData {
  name: string;
  history: Array<BenchResult>;
}

interface ModuleData {
  name: string;
  tests: Array<TestData>;
}

type BenchData = Array<ModuleData>;

function App(modules: BenchData) {
  const rows = [];
  for (const module of modules) {
    rows.push(LineChart(module));
  }
  return (
    <Fragment>
      <Helmet>
        <title>Cliffy - Benchmarks</title>
      </Helmet>
      <Helmet footer>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@v3.6.1" />
      </Helmet>
      <section class="container mx-auto p-5">
        <h2 class="text-2xl font-bold leading-7 text-gray-300 sm:text-3xl">
          Benchmarks
        </h2>
        {rows}
      </section>
    </Fragment>
  );
}

function LineChart(module: ModuleData) {
  const attrs = { id: "chart-" + module.name };
  const script = generateScript(attrs.id, module);
  return (
    <div class="bg-gray-100 border-2 rounded-lg border-gray-200 border-opacity-50 p-8 mt-8">
      <h2 class="text-gray-900 text-lg title-font font-medium mb-3">
        {capitalize(module.name)}
      </h2>
      <canvas {...attrs} height="50" width="120" />
      <Helmet footer>
        <script>{script}</script>
      </Helmet>
    </div>
  );
}

function generateScript(id: string, module: ModuleData): string {
  const config = {
    type: "line",
    data: {
      labels: module.tests[0].history.map((item: BenchResult) => item.rev),
      datasets: module.tests.map((test: TestData) => ({
        label: test.name,
        data: test.history.map((item: BenchResult) => item.measuredRunsAvgMs),
        backgroundColor: stringToColor(test.name.repeat(2)),
        borderColor: stringToColor(test.name.repeat(2)),
        tension: 0.3,
      })),
    },
  };

  return `
  {
    const element = document.getElementById("${id}");
    const config = ${JSON.stringify(config)};
    const myChart = new Chart(element, {...config});
  }`;
}

console.log("Listening on http://localhost:8000");
await serve(async () => {
  const modules: BenchData = JSON.parse(
    await Deno.readTextFile("./bench.json"),
  );
  return ssr(() => App(modules));
});

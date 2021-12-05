/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, serve } from "./deps.ts";
import { ssr } from "./ssr.tsx";

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

const modules: BenchData = JSON.parse(await Deno.readTextFile("./bench.json"));

function App() {
  const rows = [];
  for (const module of modules) {
    rows.push(LineChart(module));
  }
  return (
    <div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@v3.6.1" />
      <h1>Cliffy benchmarks</h1>
      {rows}
    </div>
  );
}

function LineChart(module: ModuleData) {
  const attrs = { id: "chart-" + module.name };
  const script = generateScript(attrs.id, module);
  return (
    <div>
      <h2>{module.name}</h2>
      <canvas {...attrs} height="50" />
      <script>{script}</script>
    </div>
  );
}

function generateScript(id: string, module: ModuleData) {
  const config = {
    type: "line",
    data: {
      labels: module.tests[0].history.map((item: BenchResult) => item.rev),
      datasets: module.tests.map((test: TestData) => ({
        label: test.name,
        data: test.history.map((item: BenchResult) => item.measuredRunsAvgMs),
        backgroundColor: stringToColor(test.name),
        borderColor: stringToColor(test.name),
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

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

console.log("Listening on http://localhost:8000");
serve(() => ssr(() => <App />));

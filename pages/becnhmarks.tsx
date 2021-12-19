/** @jsx h */

import { Component, Fragment, h, Helmet, tw } from "../deps.ts";
import { FileOptions } from "../lib/resource.ts";
import { transformGpu } from "../lib/styles.ts";
import { capitalize, sortByKey, stringToColor } from "../lib/utils.ts";

export interface BenchResult {
  totalMs: number;
  runsCount: number;
  measuredRunsAvgMs: number;
  rev: string;
  timestamp: number;
  version: typeof Deno.version;
}

export interface TestData {
  name: string;
  history: Array<BenchResult>;
}

export interface ModuleData {
  name: string;
  tests: Array<TestData>;
}

interface BenchmarksPageOptions {
  data: Array<FileOptions>;
}

export class BenchmarksPage extends Component<BenchmarksPageOptions> {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Cliffy - Benchmarks</title>
        </Helmet>
        <Helmet footer>
          <script src="https://cdn.jsdelivr.net/npm/chart.js@v3.6.1" />
        </Helmet>
        <div class={tw`${transformGpu} container mx-auto space-y-16`}>
          {this.props.data.map((file) => this.renderCharts(file))}
        </div>
      </Fragment>
    );
  }

  renderCharts({ fileName, content }: FileOptions) {
    const benchmarks: Array<ModuleData> = JSON.parse(content).sort(
      sortByKey("name"),
    );
    const name = capitalize(fileName)
      .replace(/_/g, " ")
      .replace(/\.json$/, "");
    return (
      <div>
        <h2 class={tw`text-2xl font-bold leading-7 sm:text-3xl`}>
          {name}
        </h2>
        {benchmarks.map((module) => this.renderLineChart(name, module))}
      </div>
    );
  }

  renderLineChart(benchmarkName: string, module: ModuleData) {
    const id = "chart-" + benchmarkName.replace(/ /g, "-")
      .toLowerCase() +
      module.name;
    const attrs = { id };
    const script = this.generateScript(attrs.id, module);
    return (
      <div
        class={tw
          `bg-gray-100 border-2 rounded-lg border-gray-200 border-opacity-50 p-8 mt-8`}
      >
        <h2 class={tw`text-gray-900 text-lg font-medium mb-3`}>
          {capitalize(module.name)}
        </h2>
        <canvas {...attrs} height="50" width="120" />
        <Helmet footer>
          <script>{script}</script>
        </Helmet>
      </div>
    );
  }

  generateScript(id: string, module: ModuleData): string {
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

    return `{
      const element = document.getElementById("${id}");
      const config = ${JSON.stringify(config)};
      const myChart = new Chart(element, config);
    }`;
  }
}

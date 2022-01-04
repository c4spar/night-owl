/** @jsx h */

import { Provider } from "../../../lib/provider.ts";
import { Component, h, Page } from "../../../mod.ts";

export interface BarDataProviderOptions {
  boop: string;
}

export class BarProvider
  implements Provider<BarPageOptions, BarDataProviderOptions> {
  onInit(req: Request, options: BarDataProviderOptions): BarPageOptions {
    return {
      beep: options.boop.toUpperCase(),
    };
  }
}

interface BarPageOptions {
  beep: string;
}

@Page({
  providers: [BarProvider],
})
export default class BarPage extends Component<BarPageOptions> {
  render() {
    return <div>Bar</div>;
  }
}

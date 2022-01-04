/** @jsx h */

import { Provider } from "../../../lib/provider.ts";
import { Component, h, Page } from "../../../mod.ts";

export interface FooDataProviderOptions {
  bar: string;
}

export class FooProvider
  implements Provider<FooPageOptions, FooDataProviderOptions> {
  onInit(
    req: Request,
    options: FooDataProviderOptions,
  ): FooPageOptions {
    return {
      foo: options.bar.toUpperCase(),
    };
  }
}

interface FooPageOptions {
  foo: string;
}

@Page({
  providers: [FooProvider],
})
export default class FooPage extends Component<FooPageOptions> {
  render() {
    return <div>Foo</div>;
  }
}

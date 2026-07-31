// Refined manually. Do not overwrite.

import { Component, input, effect, signal, HostBinding } from '@angular/core';

@Component({
  selector: 'ApplicationWindow',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: var(--ctp-base, #1e1e2e);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, 'Outfit', sans-serif);
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }
  `],
})
export class ApplicationWindow {
  themeMode = input<string>('catppuccin');
  flavor = input<string>('mocha');
  darkTitleBar = input<boolean>(true);

  private readonly _flavor = signal<string>('mocha');
  @HostBinding('attr.data-theme') private get themeAttr(): string {
    return this._flavor();
  }

  constructor() {
    effect(() => {
      const f = this.flavor();
      if (f) this._flavor.set(f);
    });
  }
}

// Refined manually. Do not overwrite.

import { Component, input, computed, HostBinding } from '@angular/core';

@Component({
  selector: 'qml-text',
  standalone: true,
  template: `<span>{{ text() }}<ng-content></ng-content></span>`,
  styles: [`
    :host { display: inline; }
  `],
})
export class Text {
  text = input<string>('');
  fontPixelSize = input<number>(14);
  fontFamily = input<string>('');
  color = input<string>('var(--qml-text, #cdd6f4)');
  bold = input<boolean>(false);
  italic = input<boolean>(false);
  wrap = input<boolean>(false);

  @HostBinding('style.font-size.px') get fontSize() { return this.fontPixelSize(); }
  @HostBinding('style.color') get textColor() { return this.color(); }
  @HostBinding('style.font-weight') get fontWeight() { return this.bold() ? 'bold' : null; }
  @HostBinding('style.font-style') get fontStyle() { return this.italic() ? 'italic' : null; }
  @HostBinding('style.white-space') get whiteSpace() { return this.wrap() ? 'normal' : 'nowrap'; }
}

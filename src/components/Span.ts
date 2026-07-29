
// Auto-generated from design-system/MochaDS/Span.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Span',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Span {
  text = input<string>("");
  variant = input<string>("body");
  colorName = input<string>("");
  customColor = input<string>("transparent");
  fontFamily = input<string>("");
  fontSize = input<number>(0);
  weight = input<string>("");
  weightNumber = input<number>(0);
  italic = input<boolean>(false);
  align = input<string>("left");
  decoration = input<string>("none");
  uppercase = input<boolean>(false);
  lineHeight = input<number>(0);
  letterSpacing = input<number>(0);
  selectable = input<boolean>(true);
  maxLines = input<number>(0);
  gradient = input<string>("");
  htmlTag = input<string>("");
}

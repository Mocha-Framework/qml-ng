
// Auto-generated from design-system/MochaDS/Div.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Div',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Div {
  show = input<boolean>(true);
  animate = input<boolean>(false);
  animateIn = input<string>("fade");
  animateOut = input<string>("fade");
  durationIn = input<number>(300);
  durationOut = input<number>(250);
  easingInEasing = input<number>(0);
  easingOutEasing = input<number>(0);
  enterOffset = input<number>(24);
  exitOffset = input<number>(24);
  enterScale = input<number>(0.95);
  exitScale = input<number>(0.95);
  p = input<unknown>(undefined);
  px = input<unknown>(undefined);
  py = input<unknown>(undefined);
  pt = input<unknown>(undefined);
  pr = input<unknown>(undefined);
  pb = input<unknown>(undefined);
  pl = input<unknown>(undefined);
  m = input<unknown>(undefined);
  mx = input<unknown>(undefined);
  my = input<unknown>(undefined);
  mt = input<unknown>(undefined);
  mr = input<unknown>(undefined);
  mb = input<unknown>(undefined);
  ml = input<unknown>(undefined);
  variant = input<string>("default");
  colorName = input<string>("");
  radius = input<unknown>(undefined);
  customRadius = input<number>(-1);
  shadow = input<string>("none");
  fill = input<boolean>(false);
  fillX = input<boolean>(false);
  fillY = input<boolean>(false);
  alignSelf = input<string>("");
  flexGrow = input<number>(0);
  flexShrink = input<number>(1);
  width_ = input<number>(-1);
  height_ = input<number>(-1);
  minWidth = input<number>(0);
  maxWidth = input<number>(0);
  minHeight = input<number>(0);
  maxHeight = input<number>(0);
  alignItems = input<string>("");
  zIndex = input<number>(-1);
  overflow = input<string>("visible");
  clickable = input<boolean>(false);

  clicked = output<void>();
}


// Auto-generated from design-system/MochaDS/Window.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Window',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Window {
  titleText = input<string>("");
  caption = input<string>("");
  icon = input<string>("");
  themeMode = input<string>("catppuccin");
  flavor = input<string>("");
  showCaption = input<boolean>(true);
  resizable = input<boolean>(true);
  captionHeight = input<number>(44);
  handleSize = input<number>(6);
  captionBackground = input<string>("");
  captionTextColor = input<string>("");
  buttonHover = input<string>("");
  buttonCloseHover = input<string>("");
  borderColor = input<string>("");
  minimumWidth = input<number>(400);
  minimumHeight = input<number>(300);

  minimized = output<void>();
  maximized = output<void>();
  restored = output<void>();
  closed = output<void>();
}

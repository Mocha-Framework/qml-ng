
// Auto-generated from design-system/MochaDS/Tag.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Tag',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Tag {
  text = input<string>("");
  variant = input<string>("tonal");
  color = input<string>("mauve");
  size = input<string>("sm");
  removable = input<boolean>(false);
  selected = input<boolean>(false);
  icon = input<string>("");
  draggable = input<boolean>(false);
  dragKey = input<string>("mochads-tag");

  removed = output<void>();
  clicked = output<void>();
}

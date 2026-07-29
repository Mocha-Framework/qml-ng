
// Auto-generated from design-system/MochaDS/InteractiveListCell.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'InteractiveListCell',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class InteractiveListCell {
  rowContent = input<unknown>(undefined);
  isSelected = input<boolean>(false);
  cellModelData = input<unknown>(null);
  cellIndex = input<number>(-1);
  backgroundColor = input<string>("transparent");
  hoverColor = input<string>("");
  pressedColor = input<string>("");
  borderColor = input<string>("transparent");
  hoverBorderColor = input<string>("");
  radius = input<number>(12);
  borderWidth = input<number>(1);
  paddingHorizontal = input<number>(12);
  paddingVertical = input<number>(8);
  modelData = input<unknown>("root.cellModelData");
  model = input<unknown>("root.cellModelData");
  index = input<number>(0);

  clicked = output<void>();
}

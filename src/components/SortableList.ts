
// Auto-generated from design-system/MochaDS/SortableList.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SortableList',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SortableList {
  delegate = input<unknown>("null");
  spacing = input<number>(8);
  paddingLeft = input<number>(4);
  paddingRight = input<number>(4);
  paddingTop = input<number>(4);
  paddingBottom = input<number>(4);
  listId = input<string>("");
  dragKey = input<string>("mochads-sortable");
  sortable = input<boolean>(true);
  clip = input<boolean>(true);
  dragIndex = input<number>(-1);
  dragTargetIndex = input<number>(-1);
  isDragging = input<boolean>(false);
  held = input<boolean>(false);
  model = input<unknown>("delegateRoot._model");
  modelData = input<unknown>("delegateRoot._modelData");
  index = input<number>(0);

  itemsReordered = output<{ fromIndex: number, toIndex: number }>();
  externalItemDropped = output<{ source: unknown, insertIndex: number }>();
}

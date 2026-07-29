
// Auto-generated from design-system/MochaDS/CozyList.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'CozyList',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CozyList {
  model = input<unknown>(null);
  rowContent = input<unknown>(undefined);
  spacing = input<number>(8);
  paddingLeft = input<number>(4);
  paddingRight = input<number>(4);
  paddingTop = input<number>(4);
  paddingBottom = input<number>(4);
  emptyStateIcon = input<string>("package-open");
  emptyStateTitle = input<string>("");
  emptyStateSubtitle = input<string>("");
  isLoading = input<boolean>(false);
  sortable = input<boolean>(false);
  listId = input<string>("");
  sortableDragKey = input<string>("mochads-sortable");
  dragIndex = input<number>(-1);
  dragTargetIndex = input<number>(-1);
  isDragging = input<boolean>(false);
  held = input<boolean>(false);

  itemsReordered = output<{ fromIndex: number, toIndex: number }>();
  itemClicked = output<{ modelData: unknown }>();
}

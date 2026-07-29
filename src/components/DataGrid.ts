
// Auto-generated from design-system/MochaDS/DataGrid.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'DataGrid',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DataGrid {
  model = input<unknown>(null);
  delegate = input<unknown>("null");
  sortable = input<boolean>(false);
  sortableDragKey = input<string>("mochads-datagrid");
  isDragging = input<boolean>(false);
  columns = input<number>(3);
  columnsSm = input<number>(-1);
  columnsMd = input<number>(-1);
  columnsLg = input<number>(-1);
  aspectRatio = input<number>(1.0);
  gap = input<unknown>("md");
  pad = input<number>(0);
  isLoading = input<boolean>(false);
  skeletonCount = input<number>(6);
  emptyStateTitle = input<string>("");
  emptyStateSubtitle = input<string>("");
  held = input<boolean>(false);
  cellIndex = input<number>(0);
  cellData = input<unknown>(undefined);
  modelData = input<unknown>("cellRoot.cellData");
  modelIndex = input<number>(0);

  itemsReordered = output<{ fromIndex: number, toIndex: number }>();
  itemClicked = output<{ modelData: unknown, index: number }>();
}

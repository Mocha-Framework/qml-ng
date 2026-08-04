// Auto-generated from ds-qml/qml/MochaDS/TreeTable.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'TreeTable',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"treetable"',
  },
  template: `<ng-content></ng-content>`,
})
export class TreeTable {
  columns = input<unknown>([]);
  rows = input<unknown>([]);
  selectedIndexes = input<unknown>([]);
  sortColumn = input<string>("");
  sortOrder = input<string>("asc");
  selectable = input<boolean>(true);
  flatRows = input<unknown>([]);
  sharedContentX = input<number>(0);
  sharedContentWidth = input<number>(0);

  selectionChanged = output<{ indexes: unknown }>();
  sortChanged = output<{ column: string, order: string }>();
  rowToggled = output<{ rowData: unknown, isExpanded: boolean }>();

  
}

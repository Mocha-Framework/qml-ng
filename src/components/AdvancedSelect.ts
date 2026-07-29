
// Auto-generated from design-system/MochaDS/AdvancedSelect.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AdvancedSelect',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AdvancedSelect {
  options = input<unknown>([]);
  selectedValues = input<unknown>([]);
  placeholder = input<string>("Selecione...");
  disabled = input<boolean>(false);
  searchable = input<boolean>(true);
  multiple = input<boolean>(true);
  size = input<string>("md");
  status = input<string>("normal");
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
  customRadius = input<number>(-1);
  customBorderColor = input<string>("transparent");
  customBackgroundColor = input<string>("transparent");
  searchQuery = input<string>("");

  selectionChanged = output<{ vals: unknown }>();
}

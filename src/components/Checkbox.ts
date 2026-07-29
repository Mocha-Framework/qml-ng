// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'Checkbox',
  standalone: true,
  template: `
    <label class="qml-checkbox" [class.disabled]="disabled()">
      <input type="checkbox" [checked]="checked()" [disabled]="disabled()" (change)="onToggle()" />
      <span class="qml-checkbox-checkmark">{{ checked() ? '✓' : '' }}</span>
      @if (label(); as lbl) { <span>{{ lbl }}</span> }
    </label>
  `,
  styles: [`
    .qml-checkbox { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
    .qml-checkbox.disabled { opacity: 0.5; pointer-events: none; }
    .qml-checkbox input { position: absolute; opacity: 0; pointer-events: none; }
    .qml-checkbox-checkmark { width: 18px; height: 18px; border-radius: 4px;
      background: var(--qml-surface0, #313244); display: inline-flex; align-items: center; justify-content: center;
      font-size: 12px; color: transparent; }
    .qml-checkbox:not(.disabled) input:checked + .qml-checkbox-checkmark,
    .qml-checkbox.checked .qml-checkbox-checkmark { background: var(--qml-mauve, #cba6f7); color: var(--qml-crust, #11111b); }
  `],
})
export class Checkbox {
  checked = model<boolean>(false); label = input<string>('');
  disabled = input<boolean>(false); errorText = input<string>('');
  toggled = output<{ isChecked: boolean }>();
  protected onToggle(): void {
    if (!this.disabled()) { this.checked.update(v => !v); this.toggled.emit({ isChecked: this.checked() }); }
  }
}

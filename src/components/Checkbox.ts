// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'Checkbox',
  standalone: true,
  template: `
    <label class="qml-checkbox" [class.disabled]="disabled()" [class.checked]="checked()">
      <span class="qml-checkbox-box">
        <input type="checkbox" [checked]="checked()" [disabled]="disabled()" (change)="onToggle($event)" (keydown.enter)="onToggle($event)" (keydown.space)="$event.preventDefault(); onToggle($event)" />
        <svg class="qml-checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </span>
      @if (label(); as lbl) { <span class="qml-checkbox-label">{{ lbl }}</span> }
    </label>
    @if (errorText(); as err) {
      <p class="qml-checkbox-error">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ err }}
      </p>
    }
  `,
  styles: [`
    :host { display: inline-flex; flex-direction: column; gap: 4px; font-family: var(--ctp-font-family); }
    .qml-checkbox { display: inline-flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;
      transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease; }
    .qml-checkbox:hover { transform: scale(1.03); }
    .qml-checkbox:active { transform: scale(0.97); }
    .qml-checkbox.disabled { opacity: 0.5; pointer-events: none; transform: none; }
    .qml-checkbox-box { position: relative; width: 20px; height: 20px; display: inline-flex;
      align-items: center; justify-content: center; flex-shrink: 0; }
    .qml-checkbox-box input { position: absolute; opacity: 0; width: 100%; height: 100%;
      margin: 0; cursor: pointer; }
    .qml-checkbox-icon { width: 14px; height: 14px; color: var(--ctp-crust, #11111b);
      transform: scale(0); opacity: 0; transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.12s ease; pointer-events: none; }
    .qml-checkbox::before {
      content: ''; position: absolute; width: 20px; height: 20px; border-radius: 4px;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      box-sizing: border-box; transition: background-color 0.15s ease, border-color 0.15s ease; pointer-events: none;
    }
    .qml-checkbox:hover::before { border-color: var(--ctp-overlay0, #6e738d); }
    .qml-checkbox.checked::before { background: var(--ctp-mauve, #cba6f7); border-color: var(--ctp-mauve, #cba6f7); }
    .qml-checkbox.checked .qml-checkbox-icon { transform: scale(1); opacity: 1; }
    .qml-checkbox-label { font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); }
    .qml-checkbox.disabled .qml-checkbox-label { color: var(--ctp-overlay0, #6e738d); }
    .qml-checkbox-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8);
      display: inline-flex; align-items: center; gap: 4px; }
  `],
})
export class Checkbox {
  checked = model<boolean>(false);
  label = input<string>('');
  disabled = input<boolean>(false);
  errorText = input<string>('');
  toggled = output<{ isChecked: boolean }>();
  protected onToggle(_event: Event): void {
    if (this.disabled()) return;
    this.checked.update(v => !v);
    this.toggled.emit({ isChecked: this.checked() });
  }
}

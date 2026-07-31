// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'ToggleButton',
  standalone: true,
  template: `
    <button type="button" role="switch" class="qml-toggle" [class.checked]="checked()" [disabled]="disabled()" [attr.aria-checked]="checked()" (click)="onToggle()">
      <span class="qml-toggle-track" [class.disabled]="disabled()">
        <span class="qml-toggle-thumb"></span>
      </span>
      @if (label(); as lbl) { <span class="qml-toggle-label">{{ lbl }}</span> }
    </button>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .qml-toggle { display: inline-flex; align-items: center; gap: 10px;
      background: none; border: none; cursor: pointer; padding: 0; font: inherit; color: inherit; user-select: none; }
    .qml-toggle:focus-visible { outline: 2px solid var(--ctp-mauve, #cba6f7); outline-offset: 4px; border-radius: 8px; }
    .qml-toggle[disabled] { cursor: not-allowed; opacity: 0.5; }
    .qml-toggle-track { width: 46px; height: 24px; background: var(--ctp-surface2, #585b70);
      border-radius: 9999px; position: relative; transition: background-color 0.22s ease; flex-shrink: 0; }
    .qml-toggle-track.disabled { opacity: 0.6; }
    .qml-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
      background: var(--ctp-text, #cdd6f4); border-radius: 50%;
      transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
      box-shadow: var(--ctp-shadow-sm); }
    .qml-toggle.checked .qml-toggle-track { background: var(--ctp-mauve, #cba6f7); }
    .qml-toggle.checked .qml-toggle-thumb { transform: translateX(22px); background: var(--ctp-base, #1e1e2e); }
    .qml-toggle-label { font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); }
  `],
})
export class ToggleButton {
  checked = model<boolean>(false);
  label = input<string>('');
  disabled = input<boolean>(false);
  toggled = output<{ isChecked: boolean }>();
  protected onToggle(): void {
    if (this.disabled()) return;
    this.checked.update(v => !v);
    this.toggled.emit({ isChecked: this.checked() });
  }
}

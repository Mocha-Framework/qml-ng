// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'Switch',
  standalone: true,
  template: `
    <button type="button" role="switch" class="qml-switch" [attr.data-size]="size()" [attr.data-color]="color()"
      [class.checked]="checked()" [disabled]="disabled()" [attr.aria-checked]="checked()" (click)="onToggle()">
      <span class="qml-switch-track"><span class="qml-switch-thumb"></span></span>
      @if (label(); as lbl) { <span class="qml-switch-label">{{ lbl }}</span> }
    </button>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .qml-switch { --ctp-sw-color: var(--ctp-mauve, #cba6f7);
      display: inline-flex; align-items: center; gap: 10px;
      background: none; border: none; cursor: pointer; padding: 0; font: inherit; color: inherit; user-select: none; }
    .qml-switch:focus-visible { outline: 2px solid var(--ctp-sw-color); outline-offset: 4px; border-radius: 8px; }
    .qml-switch[disabled] { cursor: not-allowed; opacity: 0.5; }
    .qml-switch-track { background: var(--ctp-surface2, #585b70); border-radius: 9999px;
      position: relative; transition: background-color 0.22s ease; flex-shrink: 0; }
    .qml-switch[data-size="sm"] .qml-switch-track { width: 36px; height: 20px; }
    .qml-switch[data-size="md"] .qml-switch-track { width: 44px; height: 24px; }
    .qml-switch[data-size="lg"] .qml-switch-track { width: 56px; height: 30px; }
    .qml-switch-thumb { position: absolute; top: 2px; left: 2px; background: var(--ctp-text, #cdd6f4);
      border-radius: 50%; transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
      box-shadow: var(--ctp-shadow-sm); }
    .qml-switch[data-size="sm"] .qml-switch-thumb { width: 14px; height: 14px; top: 3px; left: 3px; }
    .qml-switch[data-size="md"] .qml-switch-thumb { width: 18px; height: 18px; top: 3px; left: 3px; }
    .qml-switch[data-size="lg"] .qml-switch-thumb { width: 26px; height: 26px; top: 2px; left: 2px; }
    .qml-switch.checked .qml-switch-track { background: var(--ctp-sw-color); }
    .qml-switch[data-size="sm"].checked .qml-switch-thumb { transform: translateX(14px); background: var(--ctp-base); }
    .qml-switch[data-size="md"].checked .qml-switch-thumb { transform: translateX(20px); background: var(--ctp-base); }
    .qml-switch[data-size="lg"].checked .qml-switch-thumb { transform: translateX(26px); background: var(--ctp-base); }
    .qml-switch[data-color="mauve"]   { --ctp-sw-color: var(--ctp-mauve); }
    .qml-switch[data-color="blue"]    { --ctp-sw-color: var(--ctp-blue); }
    .qml-switch[data-color="green"]   { --ctp-sw-color: var(--ctp-green); }
    .qml-switch[data-color="red"]     { --ctp-sw-color: var(--ctp-red); }
    .qml-switch[data-color="yellow"]  { --ctp-sw-color: var(--ctp-yellow); }
    .qml-switch[data-color="lavender"]{ --ctp-sw-color: var(--ctp-lavender); }
    .qml-switch[data-color="primary"] { --ctp-sw-color: var(--ctp-primary); }
    .qml-switch[data-color="success"] { --ctp-sw-color: var(--ctp-success); }
    .qml-switch[data-color="warning"] { --ctp-sw-color: var(--ctp-warning); }
    .qml-switch[data-color="danger"]  { --ctp-sw-color: var(--ctp-danger); }
    .qml-switch-label { font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); }
  `],
})
export class Switch {
  checked = model<boolean>(false);
  label = input<string>('');
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  color = input<string>('mauve');
  toggled = output<{ isChecked: boolean }>();
  protected onToggle(): void {
    if (this.disabled()) return;
    this.checked.update(v => !v);
    this.toggled.emit({ isChecked: this.checked() });
  }
}

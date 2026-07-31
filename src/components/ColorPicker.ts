// Refined manually. Do not overwrite.

import { Component, model, input, signal, computed } from '@angular/core';

@Component({
  selector: 'ColorPicker',
  standalone: true,
  template: `
    <div class="qml-color-picker" [class.is-open]="open()" [class.disabled]="disabled()">
      <button type="button" class="qml-color-picker-trigger" [disabled]="disabled()" (click)="toggle()">
        <span class="qml-color-picker-swatch" [style.background]="value()"></span>
        <span class="qml-color-picker-value">{{ value() }}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      @if (open()) {
        <div class="qml-color-picker-popover" (click)="$event.stopPropagation()">
          <div class="qml-color-picker-grid">
            @for (c of swatches; track c) {
              <button type="button" class="qml-color-picker-cell" [class.active]="c === value()" [style.background]="c" (click)="select(c)" [attr.aria-label]="c"></button>
            }
          </div>
          <div class="qml-color-picker-hex">
            <label>HEX</label>
            <input type="text" [value]="value()" (input)="onHexInput($event)" maxlength="9" />
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-color-picker { position: relative; display: inline-flex; }
    .qml-color-picker-trigger { display: inline-flex; align-items: center; gap: 10px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 8px 12px; color: var(--ctp-text, #cdd6f4); cursor: pointer;
      font-family: inherit; font-size: 0.9rem; min-width: 240px; min-height: 40px;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }
    .qml-color-picker-trigger:hover:not(:disabled) { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-color-picker.is-open .qml-color-picker-trigger { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-color-picker.disabled { opacity: 0.5; pointer-events: none; }
    .qml-color-picker-swatch { width: 22px; height: 22px; border-radius: 6px; box-shadow: inset 0 0 0 1.5px var(--ctp-surface1, #45475a); flex-shrink: 0; }
    .qml-color-picker-value { flex: 1; text-align: left; font-family: monospace; font-weight: 600; text-transform: uppercase; }
    .qml-color-picker-popover { position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 14px; padding: 12px; box-shadow: var(--ctp-shadow-lg); width: 260px;
      animation: qml-cp-pop 0.16s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes qml-cp-pop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .qml-color-picker-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 12px; }
    .qml-color-picker-cell { width: 100%; aspect-ratio: 1; border-radius: 8px; border: 2px solid transparent;
      cursor: pointer; transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; }
    .qml-color-picker-cell:hover { transform: scale(1.1); }
    .qml-color-picker-cell.active { border-color: var(--ctp-text, #cdd6f4); transform: scale(1.1); }
    .qml-color-picker-hex { display: flex; align-items: center; gap: 10px; padding: 8px 0 0; border-top: 1px solid var(--ctp-surface1, #45475a); }
    .qml-color-picker-hex label { font-size: 0.75rem; font-weight: 700; color: var(--ctp-overlay0, #6e738d); }
    .qml-color-picker-hex input { flex: 1; background: var(--ctp-base, #1e1e2e); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 8px; padding: 6px 10px; color: var(--ctp-text, #cdd6f4); font-family: monospace; font-size: 0.85rem; outline: none; text-transform: uppercase; }
    .qml-color-picker-hex input:focus { border-color: var(--ctp-mauve, #cba6f7); }
  `],
  host: { '(document:click)': 'onDocClick($event)' },
})
export class ColorPicker {
  value = model<string>('#cba6f7');
  disabled = input<boolean>(false);

  protected open = signal(false);
  protected swatches = [
    '#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac',
    '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89dceb', '#74c7ec',
    '#89b4fa', '#b4befe', '#cdd6f4', '#bac2de', '#a6adc8', '#585b70',
  ];

  protected toggle(): void { if (!this.disabled()) this.open.update(v => !v); }
  protected select(c: string): void { this.value.set(c); }
  protected onHexInput(event: Event): void { const v = (event.target as HTMLInputElement).value; if (/^#[0-9a-f]{6}$/i.test(v)) this.value.set(v); }
  protected onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('qml-color-picker, ColorPicker')) this.open.set(false);
  }
}

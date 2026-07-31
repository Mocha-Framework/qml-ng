// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'RadioButton',
  standalone: true,
  template: `
    <label class="qml-radio" [class.disabled]="disabled()" [class.checked]="checked()" [attr.data-size]="size()">
      <input type="radio" [checked]="checked()" [disabled]="disabled()" [name]="name()" [value]="value()"
        (change)="onChange()" (keydown.enter)="onChange()" (keydown.space)="$event.preventDefault(); onChange()" />
      <span class="qml-radio-circle"><span class="qml-radio-dot"></span></span>
      @if (label(); as lbl) { <span class="qml-radio-label">{{ lbl }}</span> }
    </label>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .qml-radio { display: inline-flex; align-items: center; gap: 10px; cursor: pointer;
      user-select: none; transition: transform 0.12s ease, opacity 0.15s ease; --ctp-radio-color: var(--ctp-mauve, #cba6f7); }
    .qml-radio:hover:not(.disabled) { transform: scale(1.02); }
    .qml-radio:active:not(.disabled) { transform: scale(0.98); }
    .qml-radio.disabled { opacity: 0.5; pointer-events: none; }
    .qml-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
    .qml-radio-circle { display: inline-flex; align-items: center; justify-content: center;
      border-radius: 50%; background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      flex-shrink: 0; transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease; }
    .qml-radio[data-size="sm"] .qml-radio-circle { width: 14px; height: 14px; }
    .qml-radio[data-size="md"] .qml-radio-circle { width: 18px; height: 18px; }
    .qml-radio[data-size="lg"] .qml-radio-circle { width: 22px; height: 22px; }
    .qml-radio-dot { background: var(--ctp-radio-color); border-radius: 50%;
      transform: scale(0); transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .qml-radio[data-size="sm"] .qml-radio-dot { width: 6px; height: 6px; }
    .qml-radio[data-size="md"] .qml-radio-dot { width: 10px; height: 10px; }
    .qml-radio[data-size="lg"] .qml-radio-dot { width: 12px; height: 12px; }
    .qml-radio:hover:not(.disabled) .qml-radio-circle { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-radio.checked .qml-radio-circle { border-color: var(--ctp-radio-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-radio-color) 18%, transparent); }
    .qml-radio.checked .qml-radio-dot { transform: scale(1); }
    .qml-radio-label { font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); }
  `],
})
export class RadioButton {
  checked = model<boolean>(false);
  label = input<string>('');
  value = input<string>('');
  name = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  color = input<string>('mauve');
  disabled = input<boolean>(false);

  selected = output<{ value: string }>();
  protected onChange(): void {
    if (this.disabled() || this.checked()) return;
    this.checked.set(true);
    this.selected.emit({ value: this.value() });
  }
}

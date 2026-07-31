// Refined manually. Do not overwrite.

import { Component, model, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'PinInput',
  standalone: true,
  template: `
    <div class="qml-pin-input" [attr.data-size]="size()" [class.disabled]="disabled()">
      @if (label(); as lbl) { <label class="qml-pin-input-label">{{ lbl }}</label> }
      <input #hiddenInput type="text" inputmode="numeric" [value]="value()" (input)="onInput($event)" [maxlength]="length()"
        [disabled]="disabled()" class="qml-pin-hidden" autocomplete="one-time-code" />
      <div class="qml-pin-slots" (click)="focusHidden()">
        @for (char of slots(); track $index; let i = $index) {
          <span class="qml-pin-slot" [class.filled]="!!char" [class.active]="i === value().length && focused()">
            {{ char || '' }}@if (!char && i === value().length && focused()) { <span class="qml-pin-cursor"></span> }
          </span>
        }
      </div>
      @if (errorText(); as err) { <p class="qml-pin-input-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-pin-input { display: inline-flex; flex-direction: column; gap: 8px; }
    .qml-pin-input-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-pin-hidden { position: absolute; left: -9999px; opacity: 0; width: 1px; height: 1px; }
    .qml-pin-slots { display: inline-flex; gap: 8px; }
    .qml-pin-slot { width: 40px; height: 48px; background: var(--ctp-surface0, #313244);
      border: 1.5px solid var(--ctp-surface2, #585b70); border-radius: 10px;
      color: var(--ctp-text, #cdd6f4); font-family: monospace; font-size: 1.5rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease; }
    .qml-pin-input[data-size="sm"] .qml-pin-slot { width: 32px; height: 40px; font-size: 1.2rem; }
    .qml-pin-input[data-size="lg"] .qml-pin-slot { width: 48px; height: 56px; font-size: 1.75rem; }
    .qml-pin-slot.filled { border-color: var(--ctp-mauve, #cba6f7); background: var(--ctp-surface1, #45475a); }
    .qml-pin-slot.active { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-pin-cursor { display: inline-block; width: 2px; height: 24px; background: var(--ctp-mauve, #cba6f7);
      animation: qml-pin-blink 1s steps(2, end) infinite; }
    @keyframes qml-pin-blink { 50% { opacity: 0; } }
    .qml-pin-input.disabled { opacity: 0.5; pointer-events: none; }
    .qml-pin-input-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8); }
  `],
})
export class PinInput {
  value = model<string>('');
  length = input<number>(4);
  label = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  errorText = input<string>('');

  protected focused = signal(false);

  completed = output<string>();

  protected slots = computed(() => {
    const arr: string[] = [];
    const v = this.value();
    for (let i = 0; i < this.length(); i++) arr.push(v[i] || '');
    return arr;
  });

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, this.length());
    this.value.set(v);
    if (v.length === this.length()) this.completed.emit(v);
  }

  protected focusHidden(): void {
    const el = (document.activeElement?.closest('qml-pin-input, PinInput')?.querySelector('input') as HTMLInputElement);
    el?.focus();
  }
}

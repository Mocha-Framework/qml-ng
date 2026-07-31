// Refined manually. Do not overwrite.

import { Component, model, input, output, computed } from '@angular/core';

@Component({
  selector: 'Slider',
  standalone: true,
  template: `
    <div class="qml-slider" [attr.data-size]="size()" [class.disabled]="disabled()" [class.has-error]="!!errorText()">
      @if (label(); as lbl) {
        <div class="qml-slider-header">
          <span class="qml-slider-label">{{ lbl }}</span>
          @if (showValue()) { <span class="qml-slider-value">{{ displayValue() }}</span> }
        </div>
      }
      <div class="qml-slider-track-wrap">
        <div class="qml-slider-track">
          <div class="qml-slider-fill" [style.width.%]="percent()"></div>
        </div>
        <input type="range" class="qml-slider-input"
          [min]="min()" [max]="max()" [step]="step()" [value]="value()" [disabled]="disabled()"
          (input)="onInput($event)" (change)="onChange($event)" />
      </div>
      @if (errorText(); as err) { <p class="qml-slider-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-slider { display: flex; flex-direction: column; gap: 8px; width: 100%; --ctp-slider-color: var(--ctp-mauve, #cba6f7); }
    .qml-slider-header { display: flex; justify-content: space-between; align-items: center; }
    .qml-slider-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-slider-value { font-size: 0.82rem; font-weight: 700; font-family: monospace;
      background: var(--ctp-surface0, #313244); color: var(--ctp-text, #cdd6f4);
      padding: 2px 8px; border-radius: 6px; min-width: 40px; text-align: center; }
    .qml-slider-track-wrap { position: relative; display: flex; align-items: center; height: 24px; }
    .qml-slider-track { position: absolute; inset: 50% 0 auto 0; height: 6px; transform: translateY(-50%);
      background: var(--ctp-surface2, #585b70); border-radius: 9999px; pointer-events: none; }
    .qml-slider[data-size="sm"] .qml-slider-track { height: 4px; }
    .qml-slider[data-size="lg"] .qml-slider-track { height: 8px; }
    .qml-slider-fill { height: 100%; background: var(--ctp-slider-color); border-radius: 9999px;
      transition: width 0.15s ease; }
    .qml-slider-input { -webkit-appearance: none; appearance: none; flex: 1; background: transparent;
      height: 24px; padding: 0; margin: 0; cursor: pointer; position: relative; z-index: 1; }
    .qml-slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
      width: 18px; height: 18px; border-radius: 50%; background: var(--ctp-slider-color);
      border: 2px solid var(--ctp-base, #1e1e2e); box-shadow: var(--ctp-shadow-sm); cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .qml-slider[data-size="sm"] .qml-slider-input::-webkit-slider-thumb { width: 14px; height: 14px; }
    .qml-slider[data-size="lg"] .qml-slider-input::-webkit-slider-thumb { width: 22px; height: 22px; }
    .qml-slider-input::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%;
      background: var(--ctp-slider-color); border: 2px solid var(--ctp-base); cursor: pointer; }
    .qml-slider-input::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .qml-slider-input:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px color-mix(in srgb, var(--ctp-slider-color) 25%, transparent); }
    .qml-slider.disabled { opacity: 0.5; pointer-events: none; }
    .qml-slider-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8); }
  `],
})
export class Slider {
  value = model<number>(0);
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  label = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  showValue = input<boolean>(true);
  format = input<(v: number) => string>();
  errorText = input<string>('');

  changed = output<number>();

  protected percent = computed(() => {
    const range = this.max() - this.min();
    if (range <= 0) return 0;
    return Math.min(100, Math.max(0, ((this.value() - this.min()) / range) * 100));
  });

  protected displayValue = computed(() => {
    const fmt = this.format();
    return fmt ? fmt(this.value()) : String(this.value());
  });

  protected onInput(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.value.set(v);
  }
  protected onChange(_event: Event): void { this.changed.emit(this.value()); }
}

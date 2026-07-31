// Refined manually. Do not overwrite.

import { Component, model, input, signal, computed, output } from '@angular/core';

@Component({
  selector: 'RangeSelector',
  standalone: true,
  template: `
    <div class="qml-range" [class.disabled]="disabled()" [attr.data-size]="size()">
      @if (label(); as lbl) {
        <div class="qml-range-header">
          <span class="qml-range-label">{{ lbl }}</span>
          <span class="qml-range-value">{{ minValue() }} – {{ maxValue() }}</span>
        </div>
      }
      <div class="qml-range-track-wrap" #wrap>
        <div class="qml-range-track"></div>
        <div class="qml-range-fill" [style.left.%]="leftPct()" [style.right.%]="rightPct()"></div>
        <button type="button" class="qml-range-thumb" [style.left.%]="leftPct()" (pointerdown)="onDragStart($event, 'min')" [attr.aria-label]="'Min: ' + minValue()">
          @if (showTooltip()) { <span class="qml-range-tooltip">{{ minValue() }}</span> }
        </button>
        <button type="button" class="qml-range-thumb" [style.left.%]="rightPct()" (pointerdown)="onDragStart($event, 'max')" [attr.aria-label]="'Max: ' + maxValue()">
          @if (showTooltip()) { <span class="qml-range-tooltip">{{ maxValue() }}</span> }
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-range { display: flex; flex-direction: column; gap: 8px; width: 100%; --ctp-range-color: var(--ctp-mauve, #cba6f7); }
    .qml-range-header { display: flex; justify-content: space-between; align-items: center; }
    .qml-range-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-range-value { font-size: 0.82rem; font-weight: 700; font-family: monospace;
      background: var(--ctp-surface0, #313244); padding: 2px 8px; border-radius: 6px; color: var(--ctp-text, #cdd6f4); }
    .qml-range-track-wrap { position: relative; height: 28px; touch-action: none; }
    .qml-range-track { position: absolute; left: 0; right: 0; top: 50%; height: 6px; transform: translateY(-50%);
      background: var(--ctp-surface2, #585b70); border-radius: 9999px; pointer-events: none; }
    .qml-range[data-size="sm"] .qml-range-track { height: 4px; }
    .qml-range[data-size="lg"] .qml-range-track { height: 8px; }
    .qml-range-fill { position: absolute; top: 50%; height: 6px; transform: translateY(-50%);
      background: var(--ctp-range-color); border-radius: 9999px; pointer-events: none; }
    .qml-range-thumb { position: absolute; top: 50%; width: 18px; height: 18px; border-radius: 50%;
      background: var(--ctp-range-color); border: 2px solid var(--ctp-base, #1e1e2e);
      transform: translate(-50%, -50%); cursor: grab; padding: 0; z-index: 1;
      box-shadow: var(--ctp-shadow-sm); transition: transform 0.12s ease; }
    .qml-range[data-size="sm"] .qml-range-thumb { width: 14px; height: 14px; }
    .qml-range[data-size="lg"] .qml-range-thumb { width: 22px; height: 22px; }
    .qml-range-thumb:hover { transform: translate(-50%, -50%) scale(1.18); }
    .qml-range-thumb:active { cursor: grabbing; }
    .qml-range-tooltip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
      background: var(--ctp-crust, #11111b); color: var(--ctp-text, #cdd6f4); padding: 3px 8px;
      border-radius: 6px; font-size: 0.75rem; font-family: monospace; font-weight: 600;
      white-space: nowrap; box-shadow: var(--ctp-shadow-md); pointer-events: none; }
    .qml-range.disabled { opacity: 0.5; pointer-events: none; }
  `],
})
export class RangeSelector {
  minValue = model<number>(0);
  maxValue = model<number>(100);
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  label = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  showTooltip = input<boolean>(true);

  changed = output<{ min: number; max: number }>();

  protected leftPct = computed(() => this.toPct(this.minValue()));
  protected rightPct = computed(() => 100 - this.toPct(this.maxValue()));

  protected toPct(v: number): number {
    const r = this.max() - this.min();
    return r <= 0 ? 0 : Math.max(0, Math.min(100, ((v - this.min()) / r) * 100));
  }

  protected onDragStart(event: PointerEvent, which: 'min' | 'max'): void {
    if (this.disabled()) return;
    event.preventDefault();
    const target = (event.currentTarget as HTMLElement).parentElement as HTMLElement;
    const rect = target.getBoundingClientRect();
    const move = (e: PointerEvent) => {
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const raw = this.min() + pct * (this.max() - this.min());
      const stepped = Math.round(raw / this.step()) * this.step();
      if (which === 'min') {
        const nv = Math.min(stepped, this.maxValue() - this.step());
        this.minValue.set(nv);
      } else {
        const nv = Math.max(stepped, this.minValue() + this.step());
        this.maxValue.set(nv);
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      this.changed.emit({ min: this.minValue(), max: this.maxValue() });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
}

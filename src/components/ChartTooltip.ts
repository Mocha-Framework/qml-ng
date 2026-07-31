// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

export interface ChartTooltipItem { label: string; value: string | number; color?: string; }

@Component({
  selector: 'ChartTooltip',
  standalone: true,
  template: `
    <div class="qml-chart-tooltip" [class.is-visible]="visible()" [style.top.px]="y()" [style.left.px]="x()">
      @if (title(); as t) { <div class="qml-chart-tooltip-title">{{ t }}</div> }
      <div class="qml-chart-tooltip-items">
        @for (item of items(); track $index) {
          <div class="qml-chart-tooltip-item">
            <span class="qml-chart-tooltip-dot" [style.background]="item.color || 'var(--ctp-mauve)'"></span>
            <span class="qml-chart-tooltip-label">{{ item.label }}</span>
            <span class="qml-chart-tooltip-value">{{ item.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { position: fixed; pointer-events: none; z-index: 9999; font-family: var(--ctp-font-family); }
    .qml-chart-tooltip { position: absolute; transform: translate(-50%, -100%); min-width: 140px; max-width: 240px;
      background: var(--ctp-crust, #11111b); border: 1px solid var(--ctp-surface1, #45475a);
      border-radius: 8px; padding: 8px 12px; box-shadow: var(--ctp-shadow-lg);
      opacity: 0; transition: opacity 0.15s ease, transform 0.15s ease;
      transform: translate(-50%, calc(-100% - 8px));
    }
    .qml-chart-tooltip.is-visible { opacity: 1; }
    .qml-chart-tooltip-title { font-size: 0.75rem; font-weight: 700; color: var(--ctp-subtext0, #a6adc8); margin-bottom: 6px; }
    .qml-chart-tooltip-items { display: flex; flex-direction: column; gap: 4px; }
    .qml-chart-tooltip-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; }
    .qml-chart-tooltip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .qml-chart-tooltip-label { flex: 1; color: var(--ctp-subtext1, #bac2de); }
    .qml-chart-tooltip-value { font-family: monospace; font-weight: 700; color: var(--ctp-text, #cdd6f4); }
  `],
})
export class ChartTooltip {
  visible = input<boolean>(false);
  title = input<string>('');
  items = input<ChartTooltipItem[]>([]);
  x = input<number>(0);
  y = input<number>(0);
}

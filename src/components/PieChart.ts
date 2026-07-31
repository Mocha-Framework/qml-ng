// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

export interface PieDatum { label: string; value: number; color?: string; }

@Component({
  selector: 'PieChart',
  standalone: true,
  template: `
    <div class="qml-pie-chart">
      @if (title(); as t) { <div class="chart-title">{{ t }}</div> }
      <div class="qml-pie-content">
        <svg [attr.viewBox]="'0 0 ' + size() + ' ' + size()" class="qml-pie-svg">
          @for (s of slices(); track $index) {
            <path [attr.d]="s.path" [attr.fill]="s.color" stroke="var(--ctp-surface0, #313244)" stroke-width="2"/>
          }
          @if (donut()) {
            <circle [attr.cx]="size() / 2" [attr.cy]="size() / 2" [attr.r]="size() / 4"
              fill="var(--ctp-surface0, #313244)"/>
            @if (centerValue()) {
              <text [attr.x]="size() / 2" [attr.y]="size() / 2 + 4" fill="var(--ctp-text, #cdd6f4)"
                font-size="16" font-weight="700" text-anchor="middle">{{ centerValue() }}</text>
            }
          }
        </svg>
        <ul class="qml-pie-legend">
          @for (s of slices(); track $index) {
            <li class="qml-pie-legend-item">
              <span class="qml-pie-legend-color" [style.background]="s.color"></span>
              <span class="qml-pie-legend-label">{{ s.label }}</span>
              <span class="qml-pie-legend-value">{{ s.percent }}%</span>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-pie-chart { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; padding: 20px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .qml-pie-chart:hover { border-color: color-mix(in srgb, var(--ctp-mauve) 30%, transparent); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
    .chart-title { font-size: 0.9rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); margin-bottom: 12px; }
    .qml-pie-content { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
    .qml-pie-svg { width: 200px; height: 200px; flex-shrink: 0; }
    .qml-pie-legend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 160px; }
    .qml-pie-legend-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--ctp-subtext1, #bac2de); }
    .qml-pie-legend-color { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
    .qml-pie-legend-label { flex: 1; }
    .qml-pie-legend-value { font-family: monospace; font-weight: 700; color: var(--ctp-text, #cdd6f4); }
  `],
})
export class PieChart {
  data = input<PieDatum[]>([]);
  title = input<string>('');
  size = input<number>(220);
  donut = input<boolean>(false);
  centerValue = input<string>('');

  private palette = ['#cba6f7', '#89b4fa', '#a6e3a1', '#f9e2af', '#f38ba8', '#fab387', '#94e2d5', '#b4befe', '#f5c2e7'];

  protected slices = computed(() => {
    const data = this.data();
    const total = data.reduce((a, b) => a + b.value, 0) || 1;
    const cx = this.size() / 2;
    const cy = this.size() / 2;
    const r = this.size() / 2 - 4;
    let startAngle = -Math.PI / 2;
    return data.map((d, i) => {
      const angle = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const color = d.color || this.palette[i % this.palette.length];
      const percent = Math.round((d.value / total) * 100);
      const out = { path, color, label: d.label, value: d.value, percent };
      startAngle = endAngle;
      return out;
    });
  });
}

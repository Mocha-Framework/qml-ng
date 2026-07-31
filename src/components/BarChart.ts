// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

export interface BarDatum { label: string; value: number; color?: string; }

@Component({
  selector: 'BarChart',
  standalone: true,
  template: `
    <div class="qml-bar-chart">
      @if (title(); as t) { <div class="chart-title">{{ t }}</div> }
      <svg [attr.viewBox]="'0 0 ' + width() + ' ' + height()" preserveAspectRatio="none" class="qml-bar-svg">
        <defs>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--ctp-mauve, #cba6f7)" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="var(--ctp-mauve, #cba6f7)" stop-opacity="0.55"/>
          </linearGradient>
        </defs>
        @for (g of gridLines(); track $index) {
          <line [attr.x1]="padding().left" [attr.x2]="width() - padding().right"
            [attr.y1]="g.y" [attr.y2]="g.y" stroke="var(--ctp-surface1, #45475a)" stroke-width="1" stroke-dasharray="2 4"/>
          <text [attr.x]="padding().left - 8" [attr.y]="g.y + 4" fill="var(--ctp-overlay0, #6e738d)" font-size="10" text-anchor="end">{{ g.label }}</text>
        }
        @for (bar of bars(); track $index) {
          <g>
            <rect [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.w" [attr.height]="bar.h" rx="6"
              [attr.fill]="bar.color || 'url(#bar-grad)'"/>
            <text [attr.x]="bar.x + bar.w / 2" [attr.y]="height() - 8" fill="var(--ctp-subtext0, #a6adc8)" font-size="11" text-anchor="middle">{{ bar.label }}</text>
            <text [attr.x]="bar.x + bar.w / 2" [attr.y]="bar.y - 6" fill="var(--ctp-text, #cdd6f4)" font-size="11" font-weight="700" text-anchor="middle">{{ bar.value }}</text>
          </g>
        }
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-bar-chart { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; padding: 20px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .qml-bar-chart:hover { border-color: color-mix(in srgb, var(--ctp-mauve) 30%, transparent); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
    .chart-title { font-size: 0.9rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); margin-bottom: 12px; }
    .qml-bar-svg { width: 100%; height: auto; }
  `],
})
export class BarChart {
  data = input<BarDatum[]>([]);
  title = input<string>('');
  width = input<number>(560);
  height = input<number>(320);
  padding = input<{ left: number; right: number; top: number; bottom: number }>({ left: 40, right: 20, top: 24, bottom: 32 });

  protected maxValue = computed(() => Math.max(1, ...this.data().map(d => d.value)));

  protected bars = computed(() => {
    const data = this.data();
    const w = this.width(); const h = this.height(); const p = this.padding();
    const innerW = w - p.left - p.right;
    const innerH = h - p.top - p.bottom;
    const max = this.maxValue();
    const barWidth = data.length ? Math.min(60, innerW / data.length * 0.6) : 0;
    const gap = data.length ? (innerW - barWidth * data.length) / (data.length + 1) : 0;
    return data.map((d, i) => {
      const x = p.left + gap + i * (barWidth + gap);
      const bh = (d.value / max) * innerH;
      const y = p.top + (innerH - bh);
      return { x, y, w: barWidth, h: bh, label: d.label, value: d.value, color: d.color };
    });
  });

  protected gridLines = computed(() => {
    const lines: Array<{ y: number; label: string }> = [];
    const max = this.maxValue();
    const p = this.padding(); const h = this.height();
    const innerH = h - p.top - p.bottom;
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((max / 4) * (4 - i));
      const y = p.top + (innerH / 4) * i;
      lines.push({ y, label: String(v) });
    }
    return lines;
  });
}

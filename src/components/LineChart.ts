// Refined manually. Do not overwrite.

import { Component, input, computed, signal } from '@angular/core';

export interface LinePoint { label: string; value: number; }

@Component({
  selector: 'LineChart',
  standalone: true,
  template: `
    <div class="qml-line-chart">
      @if (title(); as t) { <div class="chart-title">{{ t }}</div> }
      <svg [attr.viewBox]="'0 0 ' + width() + ' ' + height()" class="qml-line-svg" (mouseleave)="hoverIndex.set(-1)">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--ctp-mauve, #cba6f7)" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="var(--ctp-mauve, #cba6f7)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        @for (g of gridLines(); track $index) {
          <line [attr.x1]="padding().left" [attr.x2]="width() - padding().right"
            [attr.y1]="g.y" [attr.y2]="g.y" stroke="var(--ctp-surface1, #45475a)" stroke-width="1" stroke-dasharray="2 4"/>
          <text [attr.x]="padding().left - 8" [attr.y]="g.y + 4" fill="var(--ctp-overlay0, #6e738d)" font-size="10" text-anchor="end">{{ g.label }}</text>
        }
        <path [attr.d]="fillPath()" fill="url(#line-fill)" stroke="none"/>
        <path [attr.d]="linePath()" fill="none" stroke="var(--ctp-mauve, #cba6f7)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        @for (p of points(); track $index; let i = $index) {
          <g>
            <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3" fill="var(--ctp-mauve, #cba6f7)"/>
            <rect [attr.x]="p.x - 18" [attr.y]="padding().top" width="36" [attr.height]="height() - padding().top - padding().bottom"
              fill="transparent" (mouseenter)="hoverIndex.set(i)"/>
            <text [attr.x]="p.x" [attr.y]="height() - 8" fill="var(--ctp-subtext0, #a6adc8)" font-size="11" text-anchor="middle">{{ p.label }}</text>
          </g>
        }
        @if (hoverIndex() >= 0 && hoverPoint(); as hp) {
          <g>
            <circle [attr.cx]="hp.x" [attr.cy]="hp.y" r="6" fill="var(--ctp-mauve, #cba6f7)" stroke="var(--ctp-base, #1e1e2e)" stroke-width="2"/>
            <g [attr.transform]="'translate(' + (hp.x + 12) + ',' + (hp.y - 12) + ')'">
              <rect x="0" y="-12" width="68" height="34" rx="6" fill="var(--ctp-crust, #11111b)" stroke="var(--ctp-surface1, #45475a)"/>
              <text x="34" y="6" fill="var(--ctp-text, #cdd6f4)" font-size="11" text-anchor="middle">{{ hp.label }}: {{ hp.value }}</text>
            </g>
          </g>
        }
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-line-chart { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; padding: 20px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .qml-line-chart:hover { border-color: color-mix(in srgb, var(--ctp-mauve) 30%, transparent); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
    .chart-title { font-size: 0.9rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); margin-bottom: 12px; }
    .qml-line-svg { width: 100%; height: auto; }
  `],
})
export class LineChart {
  data = input<LinePoint[]>([]);
  title = input<string>('');
  width = input<number>(560);
  height = input<number>(320);
  padding = input<{ left: number; right: number; top: number; bottom: number }>({ left: 40, right: 20, top: 24, bottom: 32 });

  protected hoverIndex = signal(-1);

  protected maxValue = computed(() => Math.max(1, ...this.data().map(d => d.value)));
  protected minValue = computed(() => Math.min(0, ...this.data().map(d => d.value)));

  protected points = computed(() => {
    const data = this.data();
    const w = this.width(); const h = this.height(); const p = this.padding();
    const innerW = w - p.left - p.right;
    const innerH = h - p.top - p.bottom;
    const max = this.maxValue(); const min = this.minValue();
    const range = max - min || 1;
    if (data.length === 0) return [];
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
    return data.map((d, i) => {
      const x = p.left + i * stepX;
      const y = p.top + innerH - ((d.value - min) / range) * innerH;
      return { x, y, label: d.label, value: d.value };
    });
  });

  protected linePath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  });

  protected fillPath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    const baseY = this.height() - this.padding().bottom;
    let d = `M ${pts[0].x} ${baseY} L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
    d += ` L ${pts[pts.length - 1].x} ${baseY} Z`;
    return d;
  });

  protected hoverPoint = computed(() => {
    const idx = this.hoverIndex();
    return idx >= 0 ? this.points()[idx] : null;
  });

  protected gridLines = computed(() => {
    const lines: Array<{ y: number; label: string }> = [];
    const max = this.maxValue(); const min = this.minValue();
    const p = this.padding(); const h = this.height();
    const innerH = h - p.top - p.bottom;
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((min + ((max - min) / 4) * (4 - i)));
      const y = p.top + (innerH / 4) * i;
      lines.push({ y, label: String(v) });
    }
    return lines;
  });
}

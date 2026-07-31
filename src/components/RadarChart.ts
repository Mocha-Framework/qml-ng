// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

export interface RadarPoint { axis: string; value: number; }

@Component({
  selector: 'RadarChart',
  standalone: true,
  template: `
    <div class="qml-radar">
      @if (title(); as t) { <div class="chart-title">{{ t }}</div> }
      <svg [attr.viewBox]="'0 0 ' + size() + ' ' + size()" class="qml-radar-svg">
        @for (ring of rings(); track $index) {
          <polygon [attr.points]="ring.points" fill="none"
            [attr.stroke]="$index === rings().length - 1 ? 'var(--ctp-overlay0, #6e738d)' : 'var(--ctp-surface1, #45475a)'"
            [attr.stroke-width]="$index === rings().length - 1 ? 1.5 : 1"/>
        }
        @for (axis of axes(); track $index) {
          <line [attr.x1]="cx()" [attr.y1]="cy()" [attr.x2]="axis.x" [attr.y2]="axis.y"
            stroke="var(--ctp-surface1, #45475a)" stroke-width="1"/>
          <text [attr.x]="axis.lx" [attr.y]="axis.ly" [attr.text-anchor]="axis.anchor" fill="var(--ctp-subtext0, #a6adc8)" font-size="11">{{ axis.label }}</text>
        }
        <polygon [attr.points]="dataPoints()" fill="var(--ctp-mauve, #cba6f7)" fill-opacity="0.25"
          stroke="var(--ctp-mauve, #cba6f7)" stroke-width="2"/>
        @for (p of dataPointsAsList(); track $index) {
          <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4" fill="var(--ctp-mauve, #cba6f7)"/>
        }
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-radar { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; padding: 20px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .qml-radar:hover { border-color: color-mix(in srgb, var(--ctp-mauve) 30%, transparent); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
    .chart-title { font-size: 0.9rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); margin-bottom: 12px; }
    .qml-radar-svg { width: 100%; height: auto; max-width: 360px; display: block; margin: 0 auto; }
  `],
})
export class RadarChart {
  data = input<RadarPoint[]>([]);
  title = input<string>('');
  size = input<number>(320);
  max = input<number>(100);

  protected cx = computed(() => this.size() / 2);
  protected cy = computed(() => this.size() / 2);
  protected radius = computed(() => this.size() / 2 - 30);

  protected rings = computed(() => {
    const rings: Array<{ points: string }> = [];
    const count = 4;
    for (let i = 1; i <= count; i++) {
      const ratio = i / count;
      rings.push({ points: this.polygonPoints(ratio) });
    }
    return rings;
  });

  protected axes = computed(() => {
    const data = this.data();
    const cx = this.cx(); const cy = this.cy(); const r = this.radius();
    if (data.length === 0) return [];
    const step = (Math.PI * 2) / data.length;
    return data.map((d, i) => {
      const angle = step * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const lx = cx + (r + 18) * Math.cos(angle);
      const ly = cy + (r + 18) * Math.sin(angle);
      const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
      return { x, y, lx, ly, label: d.axis, anchor };
    });
  });

  protected dataPoints = computed(() => {
    const data = this.data();
    const max = this.max();
    const cx = this.cx(); const cy = this.cy(); const r = this.radius();
    if (data.length === 0) return '';
    const step = (Math.PI * 2) / data.length;
    return data.map((d, i) => {
      const angle = step * i - Math.PI / 2;
      const ratio = Math.max(0, Math.min(1, d.value / max));
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  protected dataPointsAsList = computed(() => {
    const data = this.data();
    const max = this.max();
    const cx = this.cx(); const cy = this.cy(); const r = this.radius();
    if (data.length === 0) return [];
    const step = (Math.PI * 2) / data.length;
    return data.map((d, i) => {
      const angle = step * i - Math.PI / 2;
      const ratio = Math.max(0, Math.min(1, d.value / max));
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return { x, y };
    });
  });

  private polygonPoints(ratio: number): string {
    const data = this.data();
    const cx = this.cx(); const cy = this.cy(); const r = this.radius();
    if (data.length === 0) {
      return `${cx - r * ratio},${cy} ${cx + r * ratio},${cy}`;
    }
    const step = (Math.PI * 2) / data.length;
    return Array.from({ length: data.length }, (_, i) => {
      const angle = step * i - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }
}

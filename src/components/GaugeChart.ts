// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'GaugeChart',
  standalone: true,
  template: `
    <div class="qml-gauge">
      @if (title(); as t) { <div class="chart-title">{{ t }}</div> }
      <svg [attr.viewBox]="'0 0 ' + size() + ' ' + (size() * 0.7)" class="qml-gauge-svg">
        <path [attr.d]="bgPath()" stroke="var(--ctp-surface1, #45475a)" [attr.stroke-width]="stroke()" fill="none" stroke-linecap="round"/>
        <path [attr.d]="valuePath()" [attr.stroke]="color()" [attr.stroke-width]="stroke()" fill="none" stroke-linecap="round"
          style="transition: stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1);"/>
        <text [attr.x]="cx()" [attr.y]="cy() + 6" fill="var(--ctp-text, #cdd6f4)"
          font-size="22" font-weight="700" text-anchor="middle">{{ displayValue() }}{{ unit() }}</text>
        @if (label()) {
          <text [attr.x]="cx()" [attr.y]="cy() + 30" fill="var(--ctp-subtext0, #a6adc8)"
            font-size="11" text-anchor="middle">{{ label() }}</text>
        }
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-gauge { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; padding: 20px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .qml-gauge:hover { border-color: color-mix(in srgb, var(--ctp-mauve) 30%, transparent); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
    .chart-title { font-size: 0.9rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); margin-bottom: 12px; }
    .qml-gauge-svg { width: 100%; height: auto; max-width: 280px; }
  `],
})
export class GaugeChart {
  value = input<number>(0);
  max = input<number>(100);
  title = input<string>('');
  label = input<string>('');
  unit = input<string>('%');
  size = input<number>(220);
  stroke = input<number>(14);
  color = input<string>('var(--ctp-mauve, #cba6f7)');

  protected cx = computed(() => this.size() / 2);
  protected cy = computed(() => this.size() * 0.55);
  protected radius = computed(() => this.size() / 2 - this.stroke());
  protected percent = computed(() => Math.max(0, Math.min(1, this.value() / this.max())));
  protected displayValue = computed(() => Math.round(this.percent() * 100));

  protected bgPath = computed(() => this.arcPath(0, 1));
  protected valuePath = computed(() => this.arcPath(0, this.percent()));

  private arcPath(start: number, end: number): string {
    const cx = this.cx(); const cy = this.cy(); const r = this.radius();
    // 270deg arc: from 135° to 405° (start at lower-left, sweep to lower-right through top)
    const startAngle = Math.PI * 0.75 + (Math.PI * 1.5) * start;
    const endAngle = Math.PI * 0.75 + (Math.PI * 1.5) * end;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = (end - start) > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }
}

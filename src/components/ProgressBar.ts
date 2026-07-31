// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'ProgressBar',
  standalone: true,
  template: `
    <div class="qml-progress" [attr.data-size]="size()" [attr.data-color]="color()" [attr.data-state]="state()" [class.indeterminate]="indeterminate()">
      @if (label(); as lbl) {
        <div class="qml-progress-label-group">
          <span class="qml-progress-label">{{ lbl }}</span>
          @if (!indeterminate()) { <span class="qml-progress-value">{{ percentDisplay() }}%</span> }
        </div>
      }
      <div class="qml-progress-track">
        <div class="qml-progress-fill" [style.width.%]="indeterminate() ? null : percentDisplay()"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-progress { display: flex; flex-direction: column; gap: 8px; width: 100%; --ctp-pb-color: var(--ctp-mauve, #cba6f7); }
    .qml-progress-label-group { display: flex; justify-content: space-between; align-items: center; }
    .qml-progress-label { font-size: 0.85rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-progress-value { font-size: 0.82rem; font-weight: 700; font-family: monospace; color: var(--ctp-subtext0, #a6adc8); }
    .qml-progress-track { width: 100%; background: var(--ctp-surface0, #313244); border-radius: 9999px;
      overflow: hidden; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.15); }
    .qml-progress[data-size="sm"] .qml-progress-track { height: 6px; }
    .qml-progress[data-size="md"] .qml-progress-track { height: 10px; }
    .qml-progress[data-size="lg"] .qml-progress-track { height: 16px; }
    .qml-progress-fill { height: 100%; background: var(--ctp-pb-color); border-radius: 9999px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .qml-progress-fill::after { content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%);
      border-radius: 9999px; }
    .qml-progress[data-state="striped"] .qml-progress-fill {
      background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%);
      background-size: 1rem 1rem;
    }
    .qml-progress[data-state="animated"] .qml-progress-fill { animation: qml-pb-stripes 1s linear infinite; }
    @keyframes qml-pb-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
    .qml-progress.indeterminate .qml-progress-fill {
      width: 30% !important; position: absolute; left: -30%; top: 0; bottom: 0;
      animation: qml-pb-indet 1.5s infinite ease-in-out;
    }
    @keyframes qml-pb-indet { 0% { left: -30%; } 100% { left: 100%; } }
    .qml-progress[data-color="mauve"]   { --ctp-pb-color: var(--ctp-mauve); }
    .qml-progress[data-color="blue"]    { --ctp-pb-color: var(--ctp-blue); }
    .qml-progress[data-color="green"]   { --ctp-pb-color: var(--ctp-green); }
    .qml-progress[data-color="red"]     { --ctp-pb-color: var(--ctp-red); }
    .qml-progress[data-color="yellow"]  { --ctp-pb-color: var(--ctp-yellow); }
    .qml-progress[data-color="lavender"]{ --ctp-pb-color: var(--ctp-lavender); }
    .qml-progress[data-color="pink"]    { --ctp-pb-color: var(--ctp-pink); }
    .qml-progress[data-color="primary"] { --ctp-pb-color: var(--ctp-primary); }
    .qml-progress[data-color="success"] { --ctp-pb-color: var(--ctp-success); }
    .qml-progress[data-color="warning"] { --ctp-pb-color: var(--ctp-warning); }
    .qml-progress[data-color="danger"]  { --ctp-pb-color: var(--ctp-danger); }
    .qml-progress[data-color="info"]    { --ctp-pb-color: var(--ctp-info); }
  `],
})
export class ProgressBar {
  value = input<number>(0);
  max = input<number>(1);
  label = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  color = input<string>('mauve');
  state = input<'default' | 'striped' | 'animated'>('default');
  indeterminate = input<boolean>(false);
  showValue = input<boolean>(true);

  protected percentDisplay = computed(() => {
    const v = this.value();
    const m = this.max();
    if (m <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((v / m) * 100)));
  });
}

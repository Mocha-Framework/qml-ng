// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'SteppedProgress',
  standalone: true,
  template: `
    <div class="qml-stepped" [attr.data-color]="color()">
      @if (label(); as lbl) {
        <div class="qml-stepped-header">
          <span class="qml-stepped-label">{{ lbl }}</span>
          <span class="qml-stepped-counter">{{ currentStep() + 1 }} / {{ totalSteps() }}</span>
        </div>
      }
      <div class="qml-stepped-pills">
        @for (i of stepArray(); track i) {
          <span class="qml-stepped-pill" [class.done]="i < currentStep()" [class.current]="i === currentStep()"
            [style.animation-delay]="(i * 0.08) + 's'"></span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-stepped { display: flex; flex-direction: column; gap: 8px; width: 100%; --ctp-stepped-color: var(--ctp-mauve, #cba6f7); }
    .qml-stepped-header { display: flex; justify-content: space-between; align-items: center; }
    .qml-stepped-label { font-size: 0.85rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-stepped-counter { font-size: 0.78rem; font-weight: 700; font-family: monospace; color: var(--ctp-subtext0, #a6adc8); }
    .qml-stepped-pills { display: flex; gap: 4px; width: 100%; }
    .qml-stepped-pill { flex: 1; height: 8px; border-radius: 9999px; background: var(--ctp-surface2, #585b70);
      transition: background-color 0.3s ease, box-shadow 0.3s ease; }
    .qml-stepped-pill.done { background: var(--ctp-stepped-color); }
    .qml-stepped-pill.current { background: var(--ctp-stepped-color);
      animation: qml-stepped-pulse 1.6s ease-in-out infinite;
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--ctp-stepped-color) 60%, transparent); }
    @keyframes qml-stepped-pulse {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ctp-stepped-color) 60%, transparent); }
      50%      { box-shadow: 0 0 0 6px color-mix(in srgb, var(--ctp-stepped-color) 0%, transparent); }
    }
    .qml-stepped[data-color="mauve"]   { --ctp-stepped-color: var(--ctp-mauve); }
    .qml-stepped[data-color="blue"]    { --ctp-stepped-color: var(--ctp-blue); }
    .qml-stepped[data-color="green"]   { --ctp-stepped-color: var(--ctp-green); }
    .qml-stepped[data-color="red"]     { --ctp-stepped-color: var(--ctp-red); }
    .qml-stepped[data-color="yellow"]  { --ctp-stepped-color: var(--ctp-yellow); }
    .qml-stepped[data-color="lavender"]{ --ctp-stepped-color: var(--ctp-lavender); }
    .qml-stepped[data-color="pink"]    { --ctp-stepped-color: var(--ctp-pink); }
    .qml-stepped[data-color="primary"] { --ctp-stepped-color: var(--ctp-primary); }
    .qml-stepped[data-color="success"] { --ctp-stepped-color: var(--ctp-success); }
  `],
})
export class SteppedProgress {
  currentStep = input<number>(0);
  totalSteps = input<number>(5);
  label = input<string>('');
  color = input<string>('mauve');

  protected stepArray = computed(() => Array.from({ length: this.totalSteps() }, (_, i) => i));
}

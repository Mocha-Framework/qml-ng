// Refined manually. Do not overwrite.

import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'Steps', standalone: true,
  template: `
    @if (variant() === 'carousel') {
      <div class="qml-carousel" [style.--qml-steps-accent]="accent()">@for (_ of indices(); track $index; let i = $index) { <button [class.active]="i === currentStep()" (click)="select(i)"></button> }</div>
    } @else {
      <div class="qml-steps" [class.vertical]="orientation() === 'vertical'" [style.--qml-steps-accent]="accent()">
        <div class="track"><span [style.width.%]="orientation() === 'horizontal' ? progress() : null" [style.height.%]="orientation() === 'vertical' ? progress() : null"></span></div>
        @for (_ of indices(); track $index; let i = $index) { <button class="step" [class.active]="i === currentStep()" [class.completed]="i < currentStep()" (click)="select(i)"><i></i><span>{{ labels()[i] || '' }}</span></button> }
      </div>
    }
  `,
  styles: [`
    .qml-carousel { height:24px; display:flex; align-items:center; justify-content:center; gap:8px; } .qml-carousel button { width:8px; height:8px; padding:0; border:0; border-radius:4px; background:var(--ctp-surface2, #585b70); cursor:pointer; transition:width 200ms, background 150ms; } .qml-carousel button.active { width:20px; background:var(--qml-steps-accent); }
    .qml-steps { width:400px; height:60px; position:relative; display:flex; font-family:var(--ctp-font-family, sans-serif); } .track { position:absolute; top:10px; left:20px; right:20px; height:4px; border-radius:2px; background:var(--ctp-surface0, #313244); } .track span { display:block; height:100%; background:var(--qml-steps-accent); transition:width 250ms, height 250ms; }
    .step { flex:1; min-width:0; z-index:1; padding:0; border:0; background:transparent; color:var(--ctp-subtext0, #a6adc8); cursor:pointer; display:flex; align-items:center; flex-direction:column; gap:4px; font:500 12px inherit; } .step i { width:12px; height:12px; box-sizing:border-box; margin-top:6px; border-radius:50%; background:var(--ctp-surface2, #585b70); transition:all 150ms; } .step.active i { width:16px; height:16px; margin-top:4px; border:2px solid var(--ctp-base, #1e1e2e); background:var(--qml-steps-accent); } .step.completed i { background:var(--qml-steps-accent); } .step.active { color:var(--ctp-text, #cdd6f4); }
    .vertical { width:240px; height:400px; flex-direction:column; } .vertical .track { left:10px; top:20px; bottom:20px; right:auto; width:4px; height:auto; } .vertical .track span { width:100%; } .vertical .step { flex-direction:row; gap:16px; text-align:left; } .vertical .step i { flex:none; margin:0 0 0 6px; } .vertical .step.active i { margin-left:4px; }
  `],
})
export class Steps {
  currentStep = model<number>(0); stepsCount = input<number>(3); labels = input<string[]>([]); variant = input<'timeline' | 'carousel'>('timeline'); color = input<string>('mauve'); orientation = input<'horizontal' | 'vertical'>('horizontal'); changeStep = output<{ step: number }>();
  protected indices = computed(() => Array.from({ length: Math.max(0, this.stepsCount()) })); protected progress = computed(() => Math.min(100, Math.max(0, this.currentStep() / Math.max(1, this.stepsCount() - 1) * 100))); protected accent = computed(() => `var(--ctp-${this.color()}, var(--ctp-primary, #cba6f7))`);
  protected select(step: number): void { this.currentStep.set(step); this.changeStep.emit({ step }); }
}

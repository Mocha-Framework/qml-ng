// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

interface StepperItem { label?: string; description?: string; icon?: string; }

@Component({
  selector: 'Stepper', standalone: true,
  template: `
    <div class="qml-stepper" [class.vertical]="orientation() === 'vertical'" [style.--qml-stepper-accent]="accent()">
      <div class="track"><span [style.width.%]="orientation() === 'horizontal' ? progress() : null" [style.height.%]="orientation() === 'vertical' ? progress() : null"></span></div>
      @for (step of steps(); track $index; let i = $index) {
        <div class="step" [class.completed]="i < currentStep()" [class.active]="i === currentStep()">
          <span class="node">
            @if (variant() === 'dots') { <i></i> }
            @else if (i < currentStep()) { <qml-icon name="check" size="18" /> }
            @else if ((variant() === 'icon' || variant() === 'labeled-icon') && step.icon) { <qml-icon [name]="step.icon" size="18" /> }
            @else { {{ i + 1 }} }
          </span>
          @if (variant() !== 'dots') { <span class="copy"><strong>{{ step.label || '' }}</strong>@if (step.description) { <small>{{ step.description }}</small> }</span> }
        </div>
      }
    </div>
  `,
  styles: [`
    .qml-stepper { width:600px; height:80px; position:relative; display:flex; --node:40px; font-family:var(--ctp-font-family, sans-serif); } .track { position:absolute; top:18px; left:24px; right:24px; height:4px; overflow:hidden; border-radius:2px; background:var(--ctp-surface0, #313244); } .track span { display:block; height:100%; border-radius:inherit; background:var(--qml-stepper-accent); transition:width 250ms ease-in-out, height 250ms ease-in-out; }
    .step { flex:1; position:relative; display:flex; align-items:center; flex-direction:column; min-width:0; } .node { width:40px; height:40px; box-sizing:border-box; z-index:1; display:grid; place-items:center; border-radius:50%; color:var(--ctp-overlay1, #7f849c); background:var(--ctp-surface0, #313244); font-size:12px; font-weight:700; transition:all 150ms; }
    .step.completed .node { color:var(--ctp-crust, #11111b); background:var(--qml-stepper-accent); } .step.active .node { color:var(--qml-stepper-accent); background:var(--ctp-base, #1e1e2e); border:2px solid var(--qml-stepper-accent); transform:scale(1.1); }
    .node i { width:8px; height:8px; border-radius:50%; background:currentColor; } .copy { width:calc(100% - 16px); margin-top:4px; display:flex; flex-direction:column; text-align:center; overflow:hidden; } .copy strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--ctp-text, #cdd6f4); font-size:12px; } .copy small { color:var(--ctp-subtext0, #a6adc8); font-size:10px; }
    .vertical { width:300px; height:400px; flex-direction:column; } .vertical .track { top:20px; bottom:20px; left:30px; right:auto; width:4px; height:auto; } .vertical .track span { width:100%; } .vertical .step { min-height:0; flex-direction:row; justify-content:flex-start; gap:16px; } .vertical .copy { width:auto; margin:0; text-align:left; } .vertical .copy strong { font-size:14px; }
  `],
})
export class Stepper {
  steps = input<StepperItem[]>([]); currentStep = input<number>(0); orientation = input<'horizontal' | 'vertical'>('horizontal'); variant = input<'default' | 'dots' | 'icon' | 'labeled-icon'>('default'); color = input<string>('mauve');
  protected progress = computed(() => Math.min(100, Math.max(0, this.currentStep() / Math.max(1, this.steps().length - 1) * 100)));
  protected accent = computed(() => `var(--ctp-${this.color()}, var(--ctp-primary, #cba6f7))`);
}

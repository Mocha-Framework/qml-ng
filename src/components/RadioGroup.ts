// Refined manually. Do not overwrite.

import { Component, model, input, output } from '@angular/core';

@Component({
  selector: 'RadioGroup',
  standalone: true,
  template: `
    <div class="qml-radio-group" [attr.data-orientation]="orientation()" role="radiogroup">
      @if (label(); as lbl) { <label class="qml-radio-group-label">{{ lbl }}</label> }
      <div class="qml-radio-group-list">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-radio-group { display: flex; flex-direction: column; gap: 8px; }
    .qml-radio-group-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-radio-group-list { display: flex; gap: 16px; flex-wrap: wrap; }
    .qml-radio-group[data-orientation="vertical"] .qml-radio-group-list { flex-direction: column; gap: 10px; }
  `],
})
export class RadioGroup {
  value = model<string>('');
  label = input<string>('');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  changed = output<{ value: string }>();
}

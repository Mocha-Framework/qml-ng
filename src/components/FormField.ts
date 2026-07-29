// Refined manually. Do not overwrite.

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'qml-form-field',
  standalone: true,
  template: `
    <div class="qml-form-field" [class.has-error]="!!errorMessage()">
      @if (label(); as lbl) {
        <label class="qml-form-field-label" [attr.for]="htmlFor()">{{ lbl }}@if (required()) { <span class="qml-form-field-required">*</span> }</label>
      }
      @if (description(); as desc) { <p class="qml-form-field-description">{{ desc }}</p> }
      <ng-content></ng-content>
      @if (errorMessage(); as err) { <p class="qml-form-field-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    .qml-form-field { display: flex; flex-direction: column; gap: 4px; }
    .qml-form-field-label { font-size: 14px; font-weight: 500; color: var(--qml-text, #cdd6f4); }
    .qml-form-field-required { color: var(--qml-red, #f38ba8); margin-left: 2px; }
    .qml-form-field-description { margin: 0; font-size: 12px; color: var(--qml-subtext0, #a6adc8); }
    .qml-form-field-error { margin: 0; font-size: 12px; color: var(--qml-red, #f38ba8); }
    .qml-form-field.has-error ::ng-deep input,
    .qml-form-field.has-error ::ng-deep select { border-color: var(--qml-red, #f38ba8) !important; }
  `],
})
export class FormField {
  label = input<string>(''); description = input<string>('');
  errorMessage = input<string>(''); required = input<boolean>(false);
  htmlFor = input<string>(''); statusChange = output<string>();
}

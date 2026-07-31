// Refined manually. Do not overwrite.

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'qml-form-field',
  standalone: true,
  template: `
    <div class="qml-form-field" [attr.data-status]="status()" [class.has-error]="!!errorMessage()">
      @if (label(); as lbl) {
        <label class="qml-form-field-label" [attr.for]="htmlFor()">{{ lbl }}@if (required()) { <span class="qml-form-field-required">*</span> }</label>
      }
      @if (description(); as desc) { <p class="qml-form-field-description">{{ desc }}</p> }
      <ng-content></ng-content>
      @if (errorMessage(); as err) {
        <p class="qml-form-field-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ err }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-form-field { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .qml-form-field-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); display: flex; gap: 4px; }
    .qml-form-field-required { color: var(--ctp-red, #f38ba8); }
    .qml-form-field-description { margin: 0; font-size: 0.78rem; color: var(--ctp-overlay1, #7f849c); }
    .qml-form-field-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8);
      display: inline-flex; align-items: center; gap: 4px; }
    .qml-form-field.has-error ::ng-deep input,
    .qml-form-field.has-error ::ng-deep select,
    .qml-form-field.has-error ::ng-deep textarea { border-color: var(--ctp-red, #f38ba8) !important; }
  `],
})
export class FormField {
  label = input<string>('');
  description = input<string>('');
  errorMessage = input<string>('');
  required = input<boolean>(false);
  htmlFor = input<string>('');
  status = input<'normal' | 'success' | 'warning' | 'error'>('normal');
  statusChange = output<string>();
}

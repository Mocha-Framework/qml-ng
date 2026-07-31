// Refined manually. Do not overwrite.

import { Component, input, output, model, computed, signal, HostListener } from '@angular/core';

@Component({
  selector: 'qml-text-field',
  standalone: true,
  template: `
    <div class="qml-text-field" [class.has-error]="!!errorText()" [class.disabled]="disabled()" [class.readonly]="readOnly()" [class.is-focused]="focused()">
      @if (label(); as lbl) {
        <label class="qml-text-field-label">{{ lbl }}@if (required()) { <span class="qml-text-field-required">*</span> }</label>
      }
      <div class="qml-text-field-wrapper" [class.shake]="!!errorText()">
        @if (iconLeft(); as name) { <span class="qml-text-field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> }
        <input #inputEl class="qml-text-field-input" [type]="inputType()" [attr.inputmode]="inputMode()"
          [placeholder]="placeholder()" [value]="value()" [disabled]="disabled()" [readOnly]="readOnly()"
          [maxLength]="maxLength()"
          (input)="onInput($event)" (focus)="focused.set(true)" (blur)="focused.set(false)"
          (keydown.enter)="onEnter()" />
        @if (showClear() && type() !== 'password' && value().length > 0) {
          <button class="qml-text-field-btn" type="button" (click)="clear()" aria-label="Clear">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        }
        @if (type() === 'password') {
          <button class="qml-text-field-btn" type="button" (click)="togglePassword()" [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
            @if (showPassword()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        }
        @if (iconRight(); as name) { <span class="qml-text-field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg></span> }
      </div>
      @if (description(); as d) { <p class="qml-text-field-description">{{ d }}</p> }
      @if (errorText(); as err) {
        <p class="qml-text-field-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ err }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-text-field { display: flex; flex-direction: column; gap: 6px; position: relative; width: 100%; }
    .qml-text-field-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); display: flex; gap: 4px; }
    .qml-text-field-required { color: var(--ctp-red, #f38ba8); }
    .qml-text-field-wrapper { display: flex; align-items: center; gap: 8px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 0 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; }
    .qml-text-field-wrapper:hover:not(.shake) { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-text-field.is-focused .qml-text-field-wrapper { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); background: var(--ctp-surface1, #45475a); }
    .qml-text-field.has-error .qml-text-field-wrapper { border-color: var(--ctp-red, #f38ba8); }
    .qml-text-field.has-error.is-focused .qml-text-field-wrapper { box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-red, #f38ba8) 20%, transparent); }
    .qml-text-field.disabled { opacity: 0.6; pointer-events: none; }
    .qml-text-field.readonly .qml-text-field-wrapper { background: var(--ctp-crust, #11111b); }
    .shake { animation: qml-tf-shake 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes qml-tf-shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-4px);} 40%,80%{transform:translateX(4px);} }
    .qml-text-field-input { flex: 1; border: none; background: transparent; outline: none;
      padding: 10px 0; font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); font-family: inherit; min-width: 0; }
    .qml-text-field-input::placeholder { color: var(--ctp-overlay0, #6e738d); }
    .qml-text-field-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--ctp-overlay1, #7f849c); }
    .qml-text-field-btn { border: none; background: none; cursor: pointer; padding: 4px; line-height: 1;
      color: var(--ctp-subtext0, #a6adc8); display: inline-flex; align-items: center; justify-content: center;
      border-radius: 4px; transition: background-color 0.15s ease, color 0.15s ease; }
    .qml-text-field-btn:hover { background: var(--ctp-surface1, #45475a); color: var(--ctp-text, #cdd6f4); }
    .qml-text-field-description { margin: 0; font-size: 0.78rem; color: var(--ctp-overlay1, #7f849c); }
    .qml-text-field-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8);
      display: inline-flex; align-items: center; gap: 4px; }
  `],
})
export class TextField {
  value = model<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'password' | 'email' | 'number'>('text');
  iconLeft = input<string>('');
  iconRight = input<string>('');
  status = input<'normal' | 'success' | 'error'>('normal');
  disabled = input<boolean>(false);
  readOnly = input<boolean>(false);
  required = input<boolean>(false);
  description = input<string>('');
  errorText = input<string>('');
  maxLength = input<number>(-1);
  customRadius = input<number>(-1);
  customBorderColor = input<string>('');
  customBackgroundColor = input<string>('');

  accepted = output<void>();
  textEdited = output<void>();

  protected showPassword = signal(false);
  protected focused = signal(false);
  protected inputType = computed(() => this.type() === 'password' && this.showPassword() ? 'text' : this.type());
  protected inputMode = computed(() => this.type() === 'number' ? 'decimal' : 'text');
  protected showClear = computed(() => !this.disabled() && !this.readOnly() && this.value().length > 0);

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.textEdited.emit();
  }
  protected onEnter(): void { this.accepted.emit(); }
  protected clear(): void { this.value.set(''); }
  protected togglePassword(): void { this.showPassword.update(v => !v); }
}

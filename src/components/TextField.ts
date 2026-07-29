// Refined manually. Do not overwrite.

import { Component, input, output, model, computed, signal } from '@angular/core';

@Component({
  selector: 'qml-text-field',
  standalone: true,
  template: `
    <div class="qml-text-field" [class]="'qml-text-field-' + size()" [class.has-error]="!!errorText()" [class.disabled]="disabled()">
      <div class="qml-text-field-wrapper">
        @if (iconLeft(); as name) { <qml-icon [name]="name" size="16" /> }
        <input #inputEl class="qml-text-field-input" [type]="inputType()"
          [placeholder]="placeholder()" [value]="value()" [disabled]="disabled()" [readOnly]="readOnly()"
          (input)="onInput($event)" (keydown.enter)="onEnter()" />
        @if (showClear() && type() !== 'password') {
          <button class="qml-text-field-btn" (click)="clear()">&times;</button>
        }
        @if (type() === 'password') {
          <button class="qml-text-field-btn" (click)="togglePassword()">{{ showPassword() ? '🙈' : '👁' }}</button>
        }
        @if (iconRight(); as name) { <qml-icon [name]="name" size="16" /> }
      </div>
      @if (errorText(); as err) { <p class="qml-text-field-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    .qml-text-field-wrapper { display: flex; align-items: center; gap: 8px;
      background: var(--qml-surface0, #313244); border-radius: 12px; padding: 0 12px; border: 1px solid transparent; }
    .qml-text-field-wrapper:focus-within { border-color: var(--qml-mauve, #cba6f7); }
    .qml-text-field.has-error .qml-text-field-wrapper { border-color: var(--qml-red, #f38ba8); }
    .qml-text-field.disabled { opacity: 0.6; pointer-events: none; }
    .qml-text-field-input { flex: 1; border: none; background: transparent; outline: none;
      padding: 8px 0; font-size: 14px; color: var(--qml-text, #cdd6f4); font-family: inherit; }
    .qml-text-field-sm input { padding: 4px 0; font-size: 12px; }
    .qml-text-field-lg input { padding: 12px 0; font-size: 16px; }
    .qml-text-field-btn { border: none; background: none; cursor: pointer; font-size: 14px;
      color: var(--qml-subtext0, #a6adc8); padding: 4px; line-height: 1; }
    .qml-text-field-error { margin: 0; font-size: 12px; color: var(--qml-red, #f38ba8); }
  `],
})
export class TextField {
  value = model<string>(''); placeholder = input<string>('');
  type = input<'text' | 'password' | 'email' | 'number'>('text');
  iconLeft = input<string>(''); iconRight = input<string>('');
  status = input<'normal' | 'success' | 'error'>('normal');
  disabled = input<boolean>(false); readOnly = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md'); errorText = input<string>('');
  customRadius = input<number>(-1); customBorderColor = input<string>('transparent');
  customBackgroundColor = input<string>('transparent');
  accepted = output<void>(); textEdited = output<void>();
  protected showPassword = signal(false);
  protected inputType = computed(() => this.type() === 'password' && this.showPassword() ? 'text' : this.type());
  protected showClear = computed(() => !this.disabled() && !this.readOnly() && this.value().length > 0);
  protected onInput(event: Event): void { this.value.set((event.target as HTMLInputElement).value); this.textEdited.emit(); }
  protected onEnter(): void { this.accepted.emit(); }
  protected clear(): void { this.value.set(''); }
  protected togglePassword(): void { this.showPassword.update(v => !v); }
}

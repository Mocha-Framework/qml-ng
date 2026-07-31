// Refined manually. Do not overwrite.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'qml-button',
  standalone: true,
  host: { '[attr.data-qml-component]': '"button"' },
  template: `
    <button
      class="btn"
      [attr.data-variant]="resolvedVariant()"
      [attr.data-color]="resolvedColor()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [attr.data-state]="isLoading() ? 'loading' : ''"
      [disabled]="disabled() || isLoading()"
      [style.--btn-radius]="customRadius() > 0 ? customRadius() + 'px' : null"
      [style.backgroundColor]="customColor() !== 'transparent' ? customColor() : null"
      [style.color]="customTextColor() !== 'transparent' ? customTextColor() : null"
      (click)="handleClick($event)"
    >
      @if (isLoading()) { <span class="btn-spinner"></span> }
      @if (!isLoading() && leftIcon(); as icon) {
        <span class="qml-btn-icon">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.data-icon]="icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
      }
      <span class="btn-content">
        @if (text()) { <span>{{ text() }}</span> }
        <ng-content></ng-content>
      </span>
      @if (!isLoading() && rightIcon(); as icon) {
        <span class="qml-btn-icon">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.data-icon]="icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      font-family: var(--ctp-font-family); font-weight: 600; line-height: 1; border: 1.5px solid transparent;
      cursor: pointer; user-select: none; position: relative; overflow: hidden;
      transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), filter 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
      --ctp-btn-color-token: var(--ctp-mauve);
      padding: 10px 20px; font-size: 0.95rem; border-radius: var(--btn-radius, 12px);
    }
    .btn[data-variant="filled"] { background-color: var(--ctp-btn-color-token); color: var(--ctp-base); box-shadow: var(--ctp-shadow-sm); }
    .btn[data-variant="filled"]:hover:not(:disabled) { filter: brightness(1.08); box-shadow: var(--ctp-shadow-md); transform: translateY(-1px); }
    .btn[data-variant="filled"]:active:not(:disabled) { transform: scale(0.97); filter: brightness(0.95); }
    .btn[data-variant="tonal"] { background-color: color-mix(in srgb, var(--ctp-btn-color-token) 15%, transparent); color: var(--ctp-btn-color-token); }
    .btn[data-variant="tonal"]:hover:not(:disabled) { background-color: color-mix(in srgb, var(--ctp-btn-color-token) 25%, transparent); transform: translateY(-1px); }
    .btn[data-variant="tonal"]:active:not(:disabled) { transform: scale(0.97); }
    .btn[data-variant="outline"] { background-color: transparent; border-color: color-mix(in srgb, var(--ctp-btn-color-token) 50%, transparent); color: var(--ctp-btn-color-token); }
    .btn[data-variant="outline"]:hover:not(:disabled) { border-color: var(--ctp-btn-color-token); background-color: color-mix(in srgb, var(--ctp-btn-color-token) 8%, transparent); }
    .btn[data-variant="outline"]:active:not(:disabled) { transform: scale(0.97); }
    .btn[data-variant="ghost"] { background-color: transparent; color: var(--ctp-btn-color-token); }
    .btn[data-variant="ghost"]:hover:not(:disabled) { background-color: color-mix(in srgb, var(--ctp-btn-color-token) 8%, transparent); }
    .btn[data-variant="ghost"]:active:not(:disabled) { transform: scale(0.97); }
    .btn[data-size="sm"] { padding: 6px 12px; font-size: 0.85rem; gap: 6px; }
    .btn[data-size="md"] { padding: 10px 20px; font-size: 0.95rem; }
    .btn[data-size="lg"] { padding: 14px 28px; font-size: 1.05rem; gap: 10px; }
    .btn[data-shape="square"] { border-radius: 0; }
    .btn[data-shape="rounded"] { border-radius: var(--btn-radius, 12px); }
    .btn[data-shape="pill"] { border-radius: 9999px; }
    .btn[data-color="rosewater"] { --ctp-btn-color-token: var(--ctp-rosewater); }
    .btn[data-color="mauve"] { --ctp-btn-color-token: var(--ctp-mauve); }
    .btn[data-color="red"] { --ctp-btn-color-token: var(--ctp-red); }
    .btn[data-color="green"] { --ctp-btn-color-token: var(--ctp-green); }
    .btn[data-color="yellow"] { --ctp-btn-color-token: var(--ctp-yellow); }
    .btn[data-color="blue"] { --ctp-btn-color-token: var(--ctp-blue); }
    .btn[data-color="primary"] { --ctp-btn-color-token: var(--ctp-primary); }
    .btn[data-color="secondary"] { --ctp-btn-color-token: var(--ctp-secondary); }
    .btn[data-color="success"] { --ctp-btn-color-token: var(--ctp-success); }
    .btn[data-color="warning"] { --ctp-btn-color-token: var(--ctp-warning); }
    .btn[data-color="danger"] { --ctp-btn-color-token: var(--ctp-danger); }
    .btn[data-color="info"] { --ctp-btn-color-token: var(--ctp-info); }
    .btn:disabled { cursor: not-allowed; opacity: 0.55; filter: grayscale(0.4); box-shadow: none !important; transform: none !important; }
    .btn:focus-visible { outline: 2px solid var(--ctp-btn-color-token); outline-offset: 2px; }
    .btn-spinner { width: 1em; height: 1em; border: 2px solid currentColor; border-bottom-color: transparent;
      border-radius: 50%; display: inline-block; box-sizing: border-box; animation: btn-spin 0.65s linear infinite; flex-shrink: 0; }
    .btn[data-state="loading"] .btn-content { opacity: 0.7; }
    .btn-content { display: inline-flex; align-items: center; gap: inherit; }
    .qml-btn-icon { display: inline-flex; align-items: center; justify-content: center; }
    .qml-btn-icon svg { width: 1em; height: 1em; }
    /* ripple */
    .btn::after { content: ''; position: absolute; border-radius: 50%; transform: scale(0); opacity: 0; pointer-events: none;
      background: color-mix(in srgb, currentColor 25%, transparent); width: 100px; height: 100px; top: var(--ripple-y, 50%); left: var(--ripple-x, 50%); margin-top: -50px; margin-left: -50px; }
    .btn.rippling::after { animation: btn-ripple 0.55s ease-out; }
    @keyframes btn-ripple { to { transform: scale(2.4); opacity: 0.4; } }
    @keyframes btn-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `],
})
export class Button {
  text = input<string>('');
  variant = input<string>('primary');
  color = input<string>('mauve');
  size = input<string>('md');
  shape = input<string>('rounded');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  leftIcon = input<string>('');
  rightIcon = input<string>('');
  icon = input<string>('');
  iconRight = input<boolean>(false);
  customRadius = input<number>(-1);
  customColor = input<string>('transparent');
  customTextColor = input<string>('transparent');

  clicked = output<void>();

  protected resolvedVariant = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'filled', secondary: 'outline', danger: 'filled',
      success: 'filled', warning: 'filled', info: 'filled',
    };
    return semantic[this.variant()] ?? this.variant();
  });

  protected resolvedColor = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'mauve', danger: 'red', success: 'green',
      warning: 'yellow', info: 'sky', secondary: 'surface0',
    };
    return semantic[this.variant()] ?? this.color();
  });

  protected handleClick(event: MouseEvent): void {
    if (this.disabled() || this.isLoading()) return;
    this.clicked.emit();
    const btn = event.currentTarget as HTMLElement;
    btn.style.setProperty('--ripple-x', event.offsetX + 'px');
    btn.style.setProperty('--ripple-y', event.offsetY + 'px');
    btn.classList.remove('rippling');
    void btn.offsetWidth;
    btn.classList.add('rippling');
    setTimeout(() => btn.classList.remove('rippling'), 550);
  }
}

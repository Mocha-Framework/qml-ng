// Refined manually. Do not overwrite.

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'Badge',
  standalone: true,
  template: `
    <span class="qml-badge" [attr.data-size]="size()" [attr.data-variant]="variant()" [attr.data-color]="color()" [attr.data-shape]="shape()">
      @if (showDot()) { <span class="qml-badge-dot"></span> }
      @if (leftIcon(); as icon) {
        <span class="qml-badge-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
      }
      <ng-content></ng-content>
      @if (closable()) {
        <button class="qml-badge-close" type="button" (click)="onClose($event)" aria-label="Remove">
          <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .qml-badge { --ctp-badge-color-token: var(--ctp-mauve, #cba6f7);
      display: inline-flex; align-items: center; gap: 5px; font-weight: 600;
      line-height: 1; white-space: nowrap; user-select: none; box-sizing: border-box;
      animation: qml-badge-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
    }
    @keyframes qml-badge-pop { from { transform: scale(0.85); opacity: 0; } }
    .qml-badge:hover { transform: translateY(-1px); box-shadow: 0 4px 8px color-mix(in srgb, var(--ctp-badge-color-token) 15%, transparent); }
    .qml-badge[data-size="sm"] { padding: 2px 6px; font-size: 0.7rem; gap: 4px; height: 20px; }
    .qml-badge[data-size="md"] { padding: 3px 10px; font-size: 0.78rem; gap: 5px; height: 24px; }
    .qml-badge[data-size="lg"] { padding: 5px 12px; font-size: 0.9rem; gap: 6px; height: 32px; }
    .qml-badge[data-shape="square"] { border-radius: 0; }
    .qml-badge[data-shape="rounded"] { border-radius: 6px; }
    .qml-badge[data-shape="pill"] { border-radius: 9999px; }
    .qml-badge[data-variant="filled"] { background: var(--ctp-badge-color-token); color: var(--ctp-base, #1e1e2e); }
    .qml-badge[data-variant="tonal"] { background: color-mix(in srgb, var(--ctp-badge-color-token) 14%, transparent); color: var(--ctp-badge-color-token); }
    .qml-badge[data-variant="outline"] { background: transparent; border: 1.5px solid var(--ctp-badge-color-token); color: var(--ctp-badge-color-token); }
    .qml-badge[data-variant="flat"] { background: var(--ctp-surface0, #313244); color: var(--ctp-text, #cdd6f4); }
    .qml-badge[data-color="rosewater"] { --ctp-badge-color-token: var(--ctp-rosewater); }
    .qml-badge[data-color="mauve"]     { --ctp-badge-color-token: var(--ctp-mauve); }
    .qml-badge[data-color="red"]       { --ctp-badge-color-token: var(--ctp-red); }
    .qml-badge[data-color="maroon"]    { --ctp-badge-color-token: var(--ctp-maroon); }
    .qml-badge[data-color="peach"]     { --ctp-badge-color-token: var(--ctp-peach); }
    .qml-badge[data-color="yellow"]    { --ctp-badge-color-token: var(--ctp-yellow); }
    .qml-badge[data-color="green"]     { --ctp-badge-color-token: var(--ctp-green); }
    .qml-badge[data-color="teal"]      { --ctp-badge-color-token: var(--ctp-teal); }
    .qml-badge[data-color="sky"]       { --ctp-badge-color-token: var(--ctp-sky); }
    .qml-badge[data-color="sapphire"]  { --ctp-badge-color-token: var(--ctp-sapphire); }
    .qml-badge[data-color="blue"]      { --ctp-badge-color-token: var(--ctp-blue); }
    .qml-badge[data-color="lavender"]  { --ctp-badge-color-token: var(--ctp-lavender); }
    .qml-badge[data-color="pink"]      { --ctp-badge-color-token: var(--ctp-pink); }
    .qml-badge[data-color="flamingo"]  { --ctp-badge-color-token: var(--ctp-flamingo); }
    .qml-badge[data-color="primary"]   { --ctp-badge-color-token: var(--ctp-primary); }
    .qml-badge[data-color="secondary"] { --ctp-badge-color-token: var(--ctp-secondary); }
    .qml-badge[data-color="success"]   { --ctp-badge-color-token: var(--ctp-success); }
    .qml-badge[data-color="warning"]   { --ctp-badge-color-token: var(--ctp-warning); }
    .qml-badge[data-color="danger"]    { --ctp-badge-color-token: var(--ctp-danger); }
    .qml-badge[data-color="info"]      { --ctp-badge-color-token: var(--ctp-info); }
    .qml-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .qml-badge-icon { display: inline-flex; align-items: center; }
    .qml-badge-close { display: inline-flex; align-items: center; justify-content: center; background: none; border: none;
      padding: 0; margin: 0 0 0 2px; cursor: pointer; color: inherit; opacity: 0.65;
      transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 50%; line-height: 0; }
    .qml-badge-close:hover { opacity: 1; transform: scale(1.2) rotate(90deg); }
  `],
})
export class Badge {
  variant = input<'filled' | 'tonal' | 'outline' | 'flat'>('filled');
  size = input<'sm' | 'md' | 'lg'>('md');
  shape = input<'square' | 'rounded' | 'pill'>('rounded');
  color = input<string>('mauve');
  showDot = input<boolean>(false);
  leftIcon = input<string>('');
  closable = input<boolean>(false);

  closed = output<void>();

  protected onClose(event: MouseEvent): void { event.stopPropagation(); this.closed.emit(); }
}

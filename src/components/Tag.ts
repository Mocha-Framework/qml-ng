// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'Tag',
  standalone: true,
  template: `
    <span class="qml-tag" [attr.data-variant]="variant()" [attr.data-size]="size()" [attr.data-shape]="shape()" [attr.data-color]="color()" [class.draggable]="draggable()" [style.backgroundColor]="bgColor() || null">
      @if (leftIcon(); as icon) {
        <span class="qml-tag-icon"><svg width="0.85em" height="0.85em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
      }
      <ng-content></ng-content>
      @if (closable()) {
        <button class="qml-tag-close" type="button" (click)="onClose($event)" aria-label="Remove">
          <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); }
    .qml-tag { --ctp-tag-color-token: var(--ctp-mauve, #cba6f7);
      display: inline-flex; align-items: center; gap: 6px; font-weight: 600;
      white-space: nowrap; user-select: none; box-sizing: border-box; line-height: 1;
      transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    }
    .qml-tag.draggable { cursor: grab; }
    .qml-tag.draggable:active { cursor: grabbing; transform: scale(1.04); }
    .qml-tag[data-size="sm"] { padding: 2px 8px; font-size: 0.7rem; height: 20px; border-radius: 9999px; }
    .qml-tag[data-size="md"] { padding: 4px 10px; font-size: 0.8rem; height: 26px; border-radius: 9999px; }
    .qml-tag[data-size="lg"] { padding: 6px 14px; font-size: 0.92rem; height: 32px; border-radius: 9999px; }
    .qml-tag[data-variant="filled"] { background: var(--ctp-tag-color-token); color: var(--ctp-base, #1e1e2e); }
    .qml-tag[data-variant="tonal"] { background: color-mix(in srgb, var(--ctp-tag-color-token) 16%, transparent); color: var(--ctp-tag-color-token); }
    .qml-tag[data-variant="outline"] { background: transparent; border: 1.5px solid var(--ctp-tag-color-token); color: var(--ctp-tag-color-token); }
    .qml-tag[data-color="rosewater"] { --ctp-tag-color-token: var(--ctp-rosewater); }
    .qml-tag[data-color="mauve"]     { --ctp-tag-color-token: var(--ctp-mauve); }
    .qml-tag[data-color="red"]       { --ctp-tag-color-token: var(--ctp-red); }
    .qml-tag[data-color="maroon"]    { --ctp-tag-color-token: var(--ctp-maroon); }
    .qml-tag[data-color="peach"]     { --ctp-tag-color-token: var(--ctp-peach); }
    .qml-tag[data-color="yellow"]    { --ctp-tag-color-token: var(--ctp-yellow); }
    .qml-tag[data-color="green"]     { --ctp-tag-color-token: var(--ctp-green); }
    .qml-tag[data-color="teal"]      { --ctp-tag-color-token: var(--ctp-teal); }
    .qml-tag[data-color="sky"]       { --ctp-tag-color-token: var(--ctp-sky); }
    .qml-tag[data-color="blue"]      { --ctp-tag-color-token: var(--ctp-blue); }
    .qml-tag[data-color="lavender"]  { --ctp-tag-color-token: var(--ctp-lavender); }
    .qml-tag[data-color="pink"]      { --ctp-tag-color-token: var(--ctp-pink); }
    .qml-tag[data-color="primary"]   { --ctp-tag-color-token: var(--ctp-primary); }
    .qml-tag[data-color="secondary"] { --ctp-tag-color-token: var(--ctp-secondary); }
    .qml-tag[data-color="success"]   { --ctp-tag-color-token: var(--ctp-success); }
    .qml-tag[data-color="warning"]   { --ctp-tag-color-token: var(--ctp-warning); }
    .qml-tag[data-color="danger"]    { --ctp-tag-color-token: var(--ctp-danger); }
    .qml-tag[data-color="info"]      { --ctp-tag-color-token: var(--ctp-info); }
    .qml-tag-icon { display: inline-flex; }
    .qml-tag-close { display: inline-flex; align-items: center; justify-content: center; background: none; border: none;
      padding: 0; margin-left: 2px; cursor: pointer; color: inherit; opacity: 0.65; line-height: 0;
      transition: opacity 0.15s ease, transform 0.18s ease; }
    .qml-tag-close:hover { opacity: 1; transform: scale(1.18) rotate(90deg); }
  `],
})
export class Tag {
  variant = input<'filled' | 'tonal' | 'outline'>('filled');
  size = input<'sm' | 'md' | 'lg'>('md');
  shape = input<'pill' | 'rounded' | 'square'>('pill');
  color = input<string>('mauve');
  leftIcon = input<string>('');
  closable = input<boolean>(false);
  draggable = input<boolean>(false);
  bgColor = input<string>('');
  closed = input<() => void>();

  protected onClose(event: MouseEvent): void { event.stopPropagation(); this.closed()?.(); }
}

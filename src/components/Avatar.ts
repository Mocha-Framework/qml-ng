// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'Avatar',
  standalone: true,
  template: `
    <div class="qml-avatar" [attr.data-size]="size()" [attr.data-variant]="variant()" [attr.data-status]="status() || 'none'" [style.backgroundColor]="bgColor() || null">
      @if (src(); as s) { <img [src]="s" [alt]="name()" (error)="onImgError($event)" /> }
      @else { <span class="qml-avatar-fallback">{{ initials() }}</span> }
      @if (status()) {
        <span class="qml-avatar-status" [attr.data-status]="status()"></span>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-flex; font-family: var(--ctp-font-family); position: relative; }
    .qml-avatar { display: inline-flex; align-items: center; justify-content: center;
      border-radius: 50%; overflow: hidden; background: var(--ctp-mauve, #cba6f7); color: var(--ctp-base, #1e1e2e);
      font-weight: 700; flex-shrink: 0; user-select: none; position: relative;
      font-family: var(--ctp-font-family); border: 1.5px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
    }
    .qml-avatar[data-size="sm"] { width: 32px; height: 32px; font-size: 0.72rem; }
    .qml-avatar[data-size="md"] { width: 40px; height: 40px; font-size: 0.88rem; }
    .qml-avatar[data-size="lg"] { width: 56px; height: 56px; font-size: 1.15rem; }
    .qml-avatar[data-size="xl"] { width: 80px; height: 80px; font-size: 1.5rem; }
    .qml-avatar[data-variant="tonal"] { background: color-mix(in srgb, var(--ctp-mauve, #cba6f7) 22%, transparent); color: var(--ctp-mauve, #cba6f7); }
    .qml-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .qml-avatar-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; letter-spacing: 0.04em; text-transform: uppercase; }
    .qml-avatar-status { position: absolute; right: 0; bottom: 0; width: 25%; height: 25%; min-width: 8px; min-height: 8px;
      border-radius: 50%; border: 2px solid var(--ctp-base, #1e1e2e); box-sizing: border-box; }
    .qml-avatar-status[data-status="online"] { background: var(--ctp-green, #a6e3a1); }
    .qml-avatar-status[data-status="offline"] { background: var(--ctp-overlay0, #6e738d); }
    .qml-avatar-status[data-status="busy"] { background: var(--ctp-red, #f38ba8); }
    .qml-avatar-status[data-status="away"] { background: var(--ctp-yellow, #f9e2af); }
  `],
})
export class Avatar {
  name = input<string>('');
  src = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  variant = input<'accent' | 'tonal' | 'outline'>('accent');
  status = input<'online' | 'offline' | 'busy' | 'away' | ''>('');
  bgColor = input<string>('');

  protected initials = computed(() => {
    const n = this.name().trim();
    if (!n) return '?';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0] || '').join('').toUpperCase();
  });

  protected onImgError(_event: Event): void { /* could fall back to initials via src signal clear */ }
}

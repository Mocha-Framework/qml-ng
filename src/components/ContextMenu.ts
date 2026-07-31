// Refined manually. Do not overwrite.

import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ContextMenuItem {
  label?: string; icon?: string; shortcut?: string;
  separator?: boolean; variant?: 'default' | 'danger'; disabled?: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'ContextMenu',
  standalone: true,
  template: `
    @if (panelVisible()) {
      <div class="qml-contextmenu-backdrop" (click)="dismiss()"></div>
      <div class="qml-contextmenu-panel" [style.left.px]="x()" [style.top.px]="y()">
        @for (item of items(); track $index) {
          @if (item.separator) {
            <div class="qml-contextmenu-separator"></div>
          } @else {
            <div class="qml-contextmenu-item" [class.danger]="item.variant === 'danger'" [class.disabled]="item.disabled"
              (click)="onItemClick(item)">
              @if (item.icon) { <span class="qml-contextmenu-icon" [innerHTML]="iconSvg(item.icon, 16)"></span> }
              <span class="qml-contextmenu-label">{{ item.label }}</span>
              @if (item.shortcut) { <span class="qml-contextmenu-shortcut">{{ item.shortcut }}</span> }
            </div>
          }
        }
      </div>
    }
  `,
  styles: [`
    .qml-contextmenu-backdrop {
      position: fixed; inset: 0; z-index: 9998;
      background: transparent;
    }
    .qml-contextmenu-panel {
      position: fixed; z-index: 9999;
      width: 200px;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface0, #313244);
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      padding: 4px 0;
      font-family: var(--ctp-font-family, sans-serif);
      animation: qml-cm-in 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .qml-contextmenu-item {
      display: flex; align-items: center; gap: 8px;
      height: 36px;
      margin: 0 4px;
      padding: 0 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 100ms ease;
      color: var(--ctp-text, #cdd6f4);
    }
    .qml-contextmenu-item:hover { background: var(--ctp-surface0, #313244); }
    .qml-contextmenu-item.danger { color: var(--ctp-red, #f38ba8); }
    .qml-contextmenu-item.danger:hover { background: color-mix(in srgb, var(--ctp-red, #f38ba8) 15%, transparent); }
    .qml-contextmenu-item.disabled { color: var(--ctp-overlay0, #6c7086); cursor: not-allowed; opacity: 0.6; }
    .qml-contextmenu-icon { display: inline-flex; color: var(--ctp-subtext0, #a6adc8); flex-shrink: 0; }
    .qml-contextmenu-item.danger .qml-contextmenu-icon { color: var(--ctp-red, #f38ba8); }
    .qml-contextmenu-label { flex: 1; font-size: 14px; line-height: 1; }
    .qml-contextmenu-shortcut { font-size: 11px; color: var(--ctp-overlay1, #7f849c); }
    .qml-contextmenu-separator { height: 1px; background: var(--ctp-surface0, #313244); margin: 4px 8px; }
    @keyframes qml-cm-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `],
})
export class ContextMenu {
  items = input<ContextMenuItem[]>([]);
  open = input<boolean>(false);
  offsetX = input<number>(0);
  offsetY = input<number>(0);
  closed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);
  protected x = signal(0);
  protected y = signal(0);
  private openedInternally = signal(false);

  protected panelVisible = computed(() => this.open() || this.openedInternally());

  showAt(px: number, py: number): void {
    this.x.set(px + this.offsetX());
    this.y.set(py + this.offsetY());
    this.openedInternally.set(true);
    setTimeout(() => document.addEventListener('click', this.hostListener, true));
  }

  dismiss(): void {
    this.openedInternally.set(false);
    document.removeEventListener('click', this.hostListener, true);
    this.closed.emit();
  }

  private hostListener = (_ev: Event): void => {
    this.dismiss();
  };

  protected onItemClick(item: ContextMenuItem): void {
    if (item.disabled) return;
    item.onClick?.();
    this.dismiss();
  }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      'trash-2': '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
      pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
      cut: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
      paste: '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
// Refined manually. Do not overwrite.

import { Component, ElementRef, HostListener, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface DropdownItem {
  label?: string; icon?: string; shortcut?: string;
  separator?: boolean; variant?: 'default' | 'danger'; disabled?: boolean; keepOpen?: boolean;
}

@Component({
  selector: 'Dropdown',
  standalone: true,
  template: `
    @if (open()) {
      <div class="qml-dropdown-backdrop" (click)="close()"></div>
      <div class="qml-dropdown-panel" [style.left.px]="panelX()" [style.top.px]="panelY()"
        [attr.data-placement]="actualPlacement()">
        @for (item of itemsList(); track $index) {
          @if (item.separator) {
            <div class="qml-dropdown-divider"></div>
          } @else {
            <div class="qml-dropdown-item" [class.danger]="item.variant === 'danger'" [class.disabled]="item.disabled"
              (click)="onItemClick(item)">
              @if (item.icon) { <span class="qml-dropdown-icon" [innerHTML]="iconSvg(item.icon, 14)"></span> }
              <span class="qml-dropdown-label">{{ item.label }}</span>
              @if (item.shortcut) { <span class="qml-dropdown-shortcut">{{ item.shortcut }}</span> }
            </div>
          }
        }
      </div>
    }
  `,
  styles: [`
    .qml-dropdown-backdrop { position: fixed; inset: 0; z-index: 9998; background: transparent; }
    .qml-dropdown-panel {
      position: fixed; z-index: 9999;
      min-width: 180px; max-width: 320px;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface1, #45475a);
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      padding: 6px 0;
      font-family: var(--ctp-font-family, sans-serif);
      animation: qml-dd-in 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: top left;
    }
    .qml-dropdown-panel[data-placement*="bottom"] { transform-origin: top left; }
    .qml-dropdown-panel[data-placement*="top"] { transform-origin: bottom left; }
    .qml-dropdown-item {
      display: flex; align-items: center; gap: 8px;
      height: 36px;
      margin: 0 4px;
      padding: 0 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 100ms, color 100ms;
      color: var(--ctp-text, #cdd6f4);
      font-size: 14px;
    }
    .qml-dropdown-item:hover { background: var(--ctp-surface0, #313244); }
    .qml-dropdown-item.danger { color: var(--ctp-red, #f38ba8); }
    .qml-dropdown-item.danger:hover { background: color-mix(in srgb, var(--ctp-red, #f38ba8) 15%, transparent); color: var(--ctp-red, #f38ba8); }
    .qml-dropdown-item.disabled { color: var(--ctp-overlay0, #6c7086); cursor: not-allowed; opacity: 0.5; }
    .qml-dropdown-icon { display: inline-flex; color: var(--ctp-subtext1, #bac2de); flex-shrink: 0; }
    .qml-dropdown-item.danger .qml-dropdown-icon { color: var(--ctp-red, #f38ba8); }
    .qml-dropdown-label { flex: 1; line-height: 1; }
    .qml-dropdown-shortcut { font-size: 11px; color: var(--ctp-overlay1, #7f849c); }
    .qml-dropdown-divider { height: 1px; background: var(--ctp-surface1, #45475a); opacity: 0.7; margin: 4px 8px; }
    @keyframes qml-dd-in { from { opacity: 0; transform: scale(0.94) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `],
})
export class Dropdown {
  items = input<DropdownItem[]>([]);
  placement = input<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'>('bottom-start');
  minWidth = input<number>(180);
  disabled = input<boolean>(false);
  isOpen = model<boolean>(false);
  triggerOffset = input<number>(4);
  itemSelected = output<DropdownItem>();

  protected itemsList = computed(() => this.items());
  protected open = computed(() => this.isOpen() && !this.disabled());
  protected actualPlacement = signal<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'>('bottom-start');
  protected panelX = signal(0);
  protected panelY = signal(0);

  private triggerEl: HTMLElement | null = null;

  private readonly sanitizer = inject(DomSanitizer);

  openWith(trigger: HTMLElement): void {
    if (this.disabled()) return;
    this.triggerEl = trigger;
    this.computePlacement();
    this.isOpen.set(true);
  }

  toggle(trigger: HTMLElement): void {
    if (this.disabled()) return;
    if (this.isOpen()) this.close(); else this.openWith(trigger);
  }

  close(): void { this.isOpen.set(false); }

  private computePlacement(): void {
    if (!this.triggerEl) return;
    const r = this.triggerEl.getBoundingClientRect();
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
    const panelW = Math.max(this.minWidth(), 180);
    const panelH = 40 + this.itemsList().filter((i: DropdownItem) => !i.separator).length * 36;
    let p = this.placement();
    const spaceBelow = vh - r.bottom;
    const spaceAbove = r.top;
    if (p.startsWith('bottom') && spaceBelow < panelH + 10 && spaceAbove > spaceBelow) p = p.replace('bottom', 'top') as typeof p;
    else if (p.startsWith('top') && spaceAbove < panelH + 10 && spaceBelow > spaceAbove) p = p.replace('top', 'bottom') as typeof p;
    this.actualPlacement.set(p);
    const off = this.triggerOffset();
    let x = p.endsWith('end') ? r.right - panelW : r.left;
    let y = p.startsWith('top') ? r.top - panelH - off : r.bottom + off;
    this.panelX.set(Math.max(8, Math.min(vw - panelW - 8, x)));
    this.panelY.set(Math.max(8, Math.min(vh - panelH - 8, y)));
  }

  protected onItemClick(item: DropdownItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
    if (!item.keepOpen) this.close();
  }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
      copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      'trash-2': '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
      eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
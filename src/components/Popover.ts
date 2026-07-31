// Refined manually. Do not overwrite.

import { Component, ElementRef, computed, inject, input, model, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Popover',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="qml-popover-backdrop" (click)="close()"></div>
      <div class="qml-popover-panel" [style.left.px]="panelX()" [style.top.px]="panelY()"
        [attr.data-placement]="actualPlacement()">
        <ng-content select="[content]"></ng-content>
        @if (!hasContent()) { <ng-content></ng-content> }
      </div>
    }
  `,
  styles: [`
    .qml-popover-backdrop { position: fixed; inset: 0; z-index: 1099; background: transparent; }
    .qml-popover-panel {
      position: fixed; z-index: 1100;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface0, #313244);
      border-radius: 18px;
      padding: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, sans-serif);
      font-size: 14px;
      min-width: 200px; max-width: 360px;
      animation: qml-pop-in 150ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .qml-popover-panel[data-placement*="bottom"] { transform-origin: top center; }
    .qml-popover-panel[data-placement*="top"] { transform-origin: bottom center; }
    .qml-popover-panel[data-placement^="left"] { transform-origin: right center; }
    .qml-popover-panel[data-placement^="right"] { transform-origin: left center; }
    @keyframes qml-pop-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `],
})
export class Popover {
  placement = input<'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'>('bottom');
  isOpen = model<boolean>(false);
  disabled = input<boolean>(false);
  hasContent = input<boolean>(false);
  offset = input<number>(8);

  private triggerEl: HTMLElement | null = null;
  protected actualPlacement = signal<string>('bottom');
  protected panelX = signal(0);
  protected panelY = signal(0);

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
    const panelW = 240;
    const panelH = 120;
    let p = this.placement();
    const spaceBelow = vh - r.bottom;
    const spaceAbove = r.top;
    const spaceRight = vw - r.right;
    const spaceLeft = r.left;
    if (p.startsWith('bottom') && spaceBelow < panelH + 10 && spaceAbove > spaceBelow) p = p.replace('bottom', 'top') as typeof p;
    else if (p.startsWith('top') && spaceAbove < panelH + 10 && spaceBelow > spaceAbove) p = p.replace('top', 'bottom') as typeof p;
    else if (p.startsWith('right') && spaceRight < panelW + 10 && spaceLeft > spaceRight) p = p.replace('right', 'left') as typeof p;
    else if (p.startsWith('left') && spaceLeft < panelW + 10 && spaceRight > spaceLeft) p = p.replace('left', 'right') as typeof p;
    this.actualPlacement.set(p);
    const off = this.offset();
    let x = r.left + r.width / 2 - panelW / 2;
    let y = r.top + r.height / 2 - panelH / 2;
    if (p.startsWith('top')) y = r.top - panelH - off;
    else if (p.startsWith('bottom')) y = r.bottom + off;
    else if (p.startsWith('left')) x = r.left - panelW - off;
    else if (p.startsWith('right')) x = r.right + off;
    if (p.endsWith('start')) x = r.left;
    else if (p.endsWith('end')) x = r.right - panelW;
    this.panelX.set(Math.max(8, Math.min(vw - panelW - 8, x)));
    this.panelY.set(Math.max(8, Math.min(vh - panelH - 8, y)));
  }
}
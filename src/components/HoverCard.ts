// Refined manually. Do not overwrite.

import { Component, ElementRef, HostListener, computed, inject, input, output, signal, ViewChild, effect } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'HoverCard',
  standalone: true,
  template: `
    <span class="qml-hovercard-trigger" (mouseenter)="onTriggerEnter()" (mouseleave)="onTriggerLeave()"
      (focusin)="onTriggerEnter()" (focusout)="onTriggerLeave()" #trigger>
      <ng-content select="[trigger]"></ng-content>
      @if (!hasTrigger()) { <ng-content></ng-content> }
    </span>
    @if (open()) {
      <div class="qml-hovercard-panel"
        [style.left.px]="panelX()" [style.top.px]="panelY()"
        [attr.data-placement]="actualPlacement()">
        <ng-content select="[content]"></ng-content>
        @if (!hasContent()) { <ng-content></ng-content> }
      </div>
    }
  `,
  styles: [`
    :host { display: inline-block; position: relative; }
    .qml-hovercard-trigger { display: inline-block; }
    .qml-hovercard-panel {
      position: fixed; z-index: 1100;
      background: var(--ctp-base, #1e1e2e);
      border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 18px;
      padding: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, sans-serif);
      font-size: 14px;
      min-width: 200px; max-width: 360px;
      animation: qml-hc-in 150ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .qml-hovercard-panel[data-placement="top"]    { transform-origin: bottom center; }
    .qml-hovercard-panel[data-placement="bottom"] { transform-origin: top center; }
    .qml-hovercard-panel[data-placement="left"]   { transform-origin: right center; }
    .qml-hovercard-panel[data-placement="right"]  { transform-origin: left center; }
    @keyframes qml-hc-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `],
})
export class HoverCard {
  placement = input<'top' | 'bottom' | 'left' | 'right'>('top');
  openDelay = input<number>(300);
  closeDelay = input<number>(300);
  disabled = input<boolean>(false);
  hasTrigger = input<boolean>(false);
  hasContent = input<boolean>(false);

  @ViewChild('trigger', { static: true }) triggerRef!: ElementRef<HTMLElement>;
  protected open = signal(false);
  protected triggerHovered = signal(false);
  protected panelHovered = signal(false);
  protected actualPlacement = signal<'top' | 'bottom' | 'left' | 'right'>('top');

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected panelX = signal(0);
  protected panelY = signal(0);

  protected shouldBeOpen = computed(() => (this.triggerHovered() || this.panelHovered()) && !this.disabled());

  constructor() {
    effect(() => {
      const s = this.shouldBeOpen();
      if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
      if (this.openTimer) { clearTimeout(this.openTimer); this.openTimer = null; }
      if (s) {
        const d = this.openDelay();
        if (d > 0) this.openTimer = setTimeout(() => this.openNow(), d);
        else this.openNow();
      } else {
        const d = this.closeDelay();
        if (d > 0) this.closeTimer = setTimeout(() => this.open.set(false), d);
        else this.open.set(false);
      }
    });
  }

  private openNow(): void {
    this.computePlacement();
    this.open.set(true);
  }

  private computePlacement(): void {
    const t = this.triggerRef?.nativeElement;
    if (!t) return;
    const rect = t.getBoundingClientRect();
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
    const panelW = 240;
    const panelH = 100;
    let p = this.placement();
    const spaceBelow = vh - (rect.bottom);
    const spaceAbove = rect.top;
    const spaceRight = vw - rect.right;
    const spaceLeft = rect.left;
    if (p === 'bottom' && spaceBelow < panelH + 10 && spaceAbove > spaceBelow) p = 'top';
    else if (p === 'top' && spaceAbove < panelH + 10 && spaceBelow > spaceAbove) p = 'bottom';
    else if (p === 'right' && spaceRight < panelW + 10 && spaceLeft > spaceRight) p = 'left';
    else if (p === 'left' && spaceLeft < panelW + 10 && spaceRight > spaceLeft) p = 'right';
    this.actualPlacement.set(p);
    let x = rect.left + rect.width / 2 - panelW / 2;
    let y = rect.top + rect.height / 2 - panelH / 2;
    if (p === 'top') y = rect.top - panelH - 8;
    else if (p === 'bottom') y = rect.bottom + 8;
    else if (p === 'left') x = rect.left - panelW - 8;
    else if (p === 'right') x = rect.right + 8;
    this.panelX.set(Math.max(8, Math.min(vw - panelW - 8, x)));
    this.panelY.set(Math.max(8, Math.min(vh - panelH - 8, y)));
  }

  protected onTriggerEnter(): void { this.triggerHovered.set(true); }
  protected onTriggerLeave(): void { this.triggerHovered.set(false); }

  @HostListener('document:keydown.escape')
  protected onEsc(): void { this.open.set(false); }
}
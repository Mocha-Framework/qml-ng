// Refined manually. Do not overwrite.

import { Component, HostListener, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Drawer',
  standalone: true,
  template: `
    @if (isVisible()) {
      <div class="qml-drawer-overlay" [class.open]="open()" (click)="onBackdropClick()">
        <div class="qml-drawer-panel" [class]="panelClass()" [class.open]="open()"
          [style.width.px]="finalWidth()" [style.height.px]="finalHeight()"
          [style.max-width.vw]="position() === 'top' || position() === 'bottom' ? 100 : null"
          (click)="$event.stopPropagation()">
          @if (hasHeader()) {
            <div class="qml-drawer-header">
              <div class="qml-drawer-head-text">
                @if (title()) { <h2 class="qml-drawer-title">{{ title() }}</h2> }
                @if (subtitle()) { <p class="qml-drawer-subtitle">{{ subtitle() }}</p> }
              </div>
              @if (showCloseButton()) {
                <button class="qml-drawer-close" type="button" (click)="onClose()" aria-label="Fechar">
                  <span [innerHTML]="iconSvg('x', 18)"></span>
                </button>
              }
            </div>
            <div class="qml-drawer-divider"></div>
          }
          <div class="qml-drawer-body">
            <ng-content></ng-content>
          </div>
          @if (hasFooter()) {
            <div class="qml-drawer-divider"></div>
            <div class="qml-drawer-footer">
              <ng-content select="[footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .qml-drawer-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: color-mix(in srgb, var(--ctp-crust, #11111b) 65%, transparent);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      transition: background-color 200ms;
    }
    .qml-drawer-overlay.open { background: color-mix(in srgb, var(--ctp-crust, #11111b) 75%, transparent); }
    .qml-drawer-panel {
      position: absolute;
      background: var(--ctp-base, #1e1e2e);
      border: 1px solid var(--ctp-surface1, #45475a);
      box-shadow: var(--ctp-shadow-lg);
      display: flex; flex-direction: column;
      font-family: var(--ctp-font-family, sans-serif);
      color: var(--ctp-text, #cdd6f4);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms;
    }
    .qml-drawer-panel-right { top: 0; right: 0; bottom: 0; border-radius: 18px 0 0 18px; transform: translateX(100%); opacity: 0.94; }
    .qml-drawer-panel-right.open { transform: translateX(0); opacity: 1; }
    .qml-drawer-panel-left { top: 0; left: 0; bottom: 0; border-radius: 0 18px 18px 0; transform: translateX(-100%); opacity: 0.94; }
    .qml-drawer-panel-left.open { transform: translateX(0); opacity: 1; }
    .qml-drawer-panel-top { left: 0; right: 0; top: 0; border-radius: 0 0 18px 18px; transform: translateY(-100%); opacity: 0.94; }
    .qml-drawer-panel-top.open { transform: translateY(0); opacity: 1; }
    .qml-drawer-panel-bottom { left: 0; right: 0; bottom: 0; border-radius: 18px 18px 0 0; transform: translateY(100%); opacity: 0.94; }
    .qml-drawer-panel-bottom.open { transform: translateY(0); opacity: 1; }
    .qml-drawer-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      padding: 20px 24px; gap: 16px;
    }
    .qml-drawer-head-text { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .qml-drawer-title { margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3; }
    .qml-drawer-subtitle { margin: 0; font-size: 13px; color: var(--ctp-subtext0, #a6adc8); line-height: 1.4; }
    .qml-drawer-close {
      border: none; background: transparent; cursor: pointer;
      color: var(--ctp-subtext0, #a6adc8);
      padding: 6px; border-radius: 9999px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background-color 150ms, color 150ms;
    }
    .qml-drawer-close:hover { background: var(--ctp-surface0, #313244); color: var(--ctp-red); }
    .qml-drawer-divider { height: 1px; background: var(--ctp-surface0, #313244); margin: 0; }
    .qml-drawer-body {
      flex: 1 1 auto; min-height: 0; padding: 16px 24px;
      overflow-y: auto;
    }
    .qml-drawer-body::-webkit-scrollbar { width: 4px; }
    .qml-drawer-body::-webkit-scrollbar-track { background: transparent; }
    .qml-drawer-body::-webkit-scrollbar-thumb { background: var(--ctp-surface0, #313244); border-radius: 2px; }
    .qml-drawer-footer {
      padding: 16px 24px 20px;
      display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;
    }
  `],
})
export class Drawer {
  open = model<boolean>(false);
  title = input<string>(''); subtitle = input<string>('');
  position = input<'right' | 'left' | 'top' | 'bottom'>('right');
  size = input<number>(360);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  customRadius = input<number>(-1);
  hasFooter = input<boolean>(false);

  opened = output<void>();
  closed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);
  protected isVisible = signal(false);

  protected hasHeader = computed(() => !!this.title() || !!this.subtitle() || this.showCloseButton());
  protected panelClass = computed(() => `qml-drawer-panel qml-drawer-panel-${this.position()}`);

  protected finalWidth = computed(() => {
    const p = this.position();
    return (p === 'top' || p === 'bottom') ? null as unknown as number : this.size();
  });
  protected finalHeight = computed(() => {
    const p = this.position();
    return (p === 'left' || p === 'right') ? null as unknown as number : this.size();
  });

  constructor() {
    let last = false;
    effect(() => {
      const v = this.open();
      if (v && !last) { this.isVisible.set(true); this.opened.emit(); }
      else if (!v && last) { setTimeout(() => this.isVisible.set(false), 280); this.closed.emit(); }
      last = v;
    });
  }

  @HostListener('document:keydown.escape')
  protected onEsc(): void { if (this.open() && this.closeOnEscape()) this.close(); }

  protected onClose(): void { this.close(); }
  protected onBackdropClick(): void { if (this.closeOnBackdropClick()) this.close(); }
  private close(): void { this.open.set(false); }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = { x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>' };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
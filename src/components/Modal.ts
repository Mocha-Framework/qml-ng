// Refined manually. Do not overwrite.

import { Component, HostListener, computed, inject, input, model, output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="qml-modal-overlay" (click)="onBackdropClick($event)">
        <div class="qml-modal-container"
          [style.width.px]="finalWidth()"
          [style.height.px]="finalHeight()"
          [style.max-height.px]="finalMaxHeight()"
          (click)="$event.stopPropagation()">
          @if (showCloseButton()) {
            <button class="qml-modal-close" type="button" (click)="onClose()" aria-label="Fechar">
              <span [innerHTML]="iconSvg('x', 18)"></span>
            </button>
          }
          @if (hasHeader()) {
            <div class="qml-modal-header">
              <div class="qml-modal-head-text">
                @if (title()) { <h2 class="qml-modal-title">{{ title() }}</h2> }
                @if (subtitle()) { <p class="qml-modal-subtitle">{{ subtitle() }}</p> }
              </div>
            </div>
          }
          @if (hasHeader() && hasBody()) {
            <div class="qml-modal-divider"></div>
          }
          <div class="qml-modal-body">
            <ng-content></ng-content>
          </div>
          @if (hasFooter()) {
            <div class="qml-modal-divider"></div>
            <div class="qml-modal-footer">
              <ng-content select="[footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .qml-modal-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: color-mix(in srgb, var(--ctp-crust, #11111b) 65%, transparent);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: qml-modal-fade 0.18s ease-out;
    }
    .qml-modal-container {
      background: var(--ctp-base, #1e1e2e);
      border-radius: 18px;
      border: 1px solid var(--ctp-surface1, #45475a);
      display: flex; flex-direction: column;
      box-shadow: var(--ctp-shadow-lg);
      animation: qml-modal-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      font-family: var(--ctp-font-family, sans-serif);
      color: var(--ctp-text, #cdd6f4);
      overflow: hidden;
    }
    .qml-modal-close {
      position: absolute; top: 16px; right: 16px; z-index: 1;
      border: none; background: transparent; cursor: pointer;
      color: var(--ctp-subtext0, #a6adc8);
      padding: 6px; border-radius: 9999px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background-color 150ms, color 150ms;
    }
    .qml-modal-close:hover { background: var(--ctp-surface0, #313244); color: var(--ctp-red); }
    .qml-modal-header { padding: 24px 24px 16px; padding-right: 48px; }
    .qml-modal-head-text { display: flex; flex-direction: column; gap: 4px; }
    .qml-modal-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--ctp-text, #cdd6f4); line-height: 1.3; }
    .qml-modal-subtitle { margin: 0; font-size: 13px; color: var(--ctp-subtext0, #a6adc8); line-height: 1.4; }
    .qml-modal-divider { height: 1px; background: var(--ctp-surface0, #313244); margin: 0; }
    .qml-modal-body { padding: 16px 24px; overflow-y: auto; flex: 1 1 auto; min-height: 0; }
    .qml-modal-body::-webkit-scrollbar { width: 4px; }
    .qml-modal-body::-webkit-scrollbar-track { background: transparent; }
    .qml-modal-body::-webkit-scrollbar-thumb { background: var(--ctp-surface0, #313244); border-radius: 2px; }
    .qml-modal-body::-webkit-scrollbar-thumb:hover { background: var(--ctp-surface1, #45475a); }
    .qml-modal-footer {
      padding: 16px 24px 24px;
      display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;
    }
    @keyframes qml-modal-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes qml-modal-in { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `],
})
export class Modal {
  open = model<boolean>(false);
  title = input<string>(''); subtitle = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');
  customWidth = input<number>(-1); customHeight = input<number>(-1);
  minBodyHeight = input<number>(120);
  maxHeight = input<number>(-1);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  hasFooter = input<boolean>(false);
  viewportHeight = input<number>(0);

  accepted = output<void>(); rejected = output<void>();
  opened = output<void>(); closed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  protected hasHeader = computed(() => !!this.title() || !!this.subtitle() || this.showCloseButton());
  protected hasBody = computed(() => true);

  protected finalWidth = computed(() => {
    if (this.customWidth() > 0) return this.customWidth();
    const widths: Record<string, number> = { sm: 400, md: 600, lg: 800 };
    if (this.size() === 'full') {
      const vh = this.viewportHeight() || (typeof window !== 'undefined' ? window.innerHeight : 800);
      return Math.min(vh, 1200);
    }
    return widths[this.size()] ?? 600;
  });

  protected finalHeight = computed(() => {
    if (this.customHeight() > 0) return this.customHeight();
    return null as unknown as number;
  });

  protected finalMaxHeight = computed(() => {
    if (this.maxHeight() > 0) return this.maxHeight();
    if (this.size() === 'full') return 99999;
    const vh = this.viewportHeight() || (typeof window !== 'undefined' ? window.innerHeight : 800);
    return Math.round(vh * 0.7);
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void { if (this.open() && this.closeOnEscape()) this.close(); }

  protected onClose(): void { this.close(); }
  protected onBackdropClick(_event: MouseEvent): void {
    if (this.closeOnBackdropClick()) this.close();
  }
  private close(): void { this.open.set(false); this.rejected.emit(); this.closed.emit(); }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
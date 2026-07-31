// Refined manually. Do not overwrite.

import { Component, ElementRef, computed, inject, input, model, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'AlertDialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="qml-alert-overlay" (click)="onBackdropClick()">
        <div class="qml-alert-panel" [style.width.px]="width()" (click)="$event.stopPropagation()">
          @if (showCloseButton()) {
            <button class="qml-alert-close" type="button" (click)="onClose()" aria-label="Fechar">
              <span [innerHTML]="iconSvg('x', 18)"></span>
            </button>
          }
          <div class="qml-alert-body">
            <span class="qml-alert-icon" [style.color]="accentColor()" [innerHTML]="iconSvg(typeIcon(), 28)"></span>
            <div class="qml-alert-text">
              @if (dialogTitle()) { <h2 class="qml-alert-title">{{ dialogTitle() }}</h2> }
              @if (dialogMessage()) { <p class="qml-alert-message">{{ dialogMessage() }}</p> }
            </div>
          </div>
          <div class="qml-alert-divider"></div>
          <div class="qml-alert-footer">
            @if (showCancel()) {
              <button type="button" class="qml-alert-btn qml-alert-btn-ghost" (click)="onCancel()">{{ cancelLabel() }}</button>
            }
            <button type="button" class="qml-alert-btn" [class.qml-alert-btn-danger]="dialogType() === 'error'" [class.qml-alert-btn-primary]="dialogType() !== 'error'"
              (click)="onConfirm()">{{ confirmLabel() }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .qml-alert-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: color-mix(in srgb, var(--ctp-crust, #11111b) 65%, transparent);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: qml-alert-fade 180ms ease-out;
    }
    .qml-alert-panel {
      position: relative;
      width: 420px;
      background: var(--ctp-base, #1e1e2e);
      border-radius: 18px;
      border: 1px solid var(--ctp-surface1, #45475a);
      padding: 24px 24px 0;
      display: flex; flex-direction: column;
      box-shadow: var(--ctp-shadow-lg);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, sans-serif);
      animation: qml-alert-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .qml-alert-close {
      position: absolute; top: 16px; right: 16px;
      border: none; background: transparent; cursor: pointer;
      color: var(--ctp-subtext0, #a6adc8);
      padding: 6px; border-radius: 9999px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .qml-alert-close:hover { background: var(--ctp-surface0, #313244); color: var(--ctp-red); }
    .qml-alert-body {
      display: flex; gap: 16px; align-items: flex-start;
      padding: 8px 0 24px;
    }
    .qml-alert-icon { display: inline-flex; flex-shrink: 0; }
    .qml-alert-text { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .qml-alert-title { margin: 0; font-size: 16px; font-weight: 700; line-height: 1.3; }
    .qml-alert-message { margin: 0; font-size: 14px; line-height: 1.5; color: var(--ctp-subtext0, #a6adc8); }
    .qml-alert-divider { height: 1px; background: var(--ctp-surface0, #313244); }
    .qml-alert-footer {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 16px 0 20px;
    }
    .qml-alert-btn {
      font-family: var(--ctp-font-family, sans-serif);
      font-size: 14px; font-weight: 600;
      border: none; border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      transition: filter 150ms;
    }
    .qml-alert-btn:hover { filter: brightness(1.1); }
    .qml-alert-btn-primary { background: var(--ctp-mauve, #cba6f7); color: var(--ctp-base, #1e1e2e); }
    .qml-alert-btn-danger { background: var(--ctp-red, #f38ba8); color: var(--ctp-base, #1e1e2e); }
    .qml-alert-btn-ghost { background: transparent; color: var(--ctp-subtext0, #a6adc8); }
    .qml-alert-btn-ghost:hover { background: var(--ctp-surface0, #313244); }
    @keyframes qml-alert-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes qml-alert-in { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `],
})
export class AlertDialog {
  open = model<boolean>(false);
  dialogType = input<'info' | 'success' | 'warning' | 'error'>('info');
  dialogTitle = input<string>('');
  dialogMessage = input<string>('');
  confirmLabel = input<string>('Confirmar');
  cancelLabel = input<string>('Cancelar');
  showCancel = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  closeOnBackdropClick = input<boolean>(true);
  width = input<number>(420);

  confirmed = output<void>();
  cancelled = output<void>();
  closed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  protected accentColor = computed(() => {
    switch (this.dialogType()) {
      case 'success': return 'var(--ctp-green, #a6e3a1)';
      case 'warning': return 'var(--ctp-yellow, #f9e2af)';
      case 'error': return 'var(--ctp-red, #f38ba8)';
      default: return 'var(--ctp-mauve, #cba6f7)';
    }
  });

  protected typeIcon = computed(() => {
    switch (this.dialogType()) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      default: return 'info';
    }
  });

  protected onConfirm(): void { this.confirmed.emit(); this.close(); }
  protected onCancel(): void { this.cancelled.emit(); this.close(); }
  protected onClose(): void { this.close(); }
  protected onBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      if (!this.showCancel()) this.confirmed.emit();
      this.close();
    }
  }
  private close(): void { this.open.set(false); this.closed.emit(); }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
      'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
      'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
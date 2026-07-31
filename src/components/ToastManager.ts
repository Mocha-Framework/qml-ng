// Refined manually. Do not overwrite.

import { Component, Injectable, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ToastEntry {
  id: number; title: string; message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number; showClose: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _entries = signal<ToastEntry[]>([]);
  readonly entries = this._entries.asReadonly();
  private nextId = 1;

  show(message: string, type: ToastEntry['type'] = 'info', title = '', duration = 3000): void {
    this._entries.update((list: ToastEntry[]) => [
      ...list,
      { id: this.nextId++, message, type, title, duration, showClose: true },
    ]);
  }

  success(message: string, title = 'Sucesso', duration = 3000): void { this.show(message, 'success', title, duration); }
  error(message: string, title = 'Erro', duration = 3000): void { this.show(message, 'error', title, duration); }
  warning(message: string, title = 'Atenção', duration = 3000): void { this.show(message, 'warning', title, duration); }
  info(message: string, title = 'Informação', duration = 3000): void { this.show(message, 'info', title, duration); }

  remove(id: number): void {
    this._entries.update((list: ToastEntry[]) => list.filter((e: ToastEntry) => e.id !== id));
  }
}

@Component({
  selector: 'ToastManager',
  standalone: true,
  template: `
    @if (service.entries().length > 0) {
      <div class="qml-toastmanager" [attr.data-position]="position()" [class]="'qml-toastmanager-' + position()">
        @for (entry of service.entries(); track entry.id) {
          <div class="qml-toastmanager-item">
            <span class="qml-toastmanager-icon" [style.color]="accentFor(entry.type)" [innerHTML]="iconSvg(iconFor(entry.type), 20)"></span>
            <div class="qml-toastmanager-text">
              <div class="qml-toastmanager-title">{{ resolvedTitle(entry) }}</div>
              <div class="qml-toastmanager-message">{{ entry.message }}</div>
            </div>
            @if (entry.showClose) {
              <button class="qml-toastmanager-close" type="button" (click)="service.remove(entry.id)" aria-label="Fechar">
                <span [innerHTML]="iconSvg('x', 16)"></span>
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .qml-toastmanager {
      position: fixed; z-index: 99999;
      display: flex; flex-direction: column; gap: 8px; pointer-events: none;
      padding: 16px;
    }
    .qml-toastmanager-top-right { top: 0; right: 0; align-items: flex-end; }
    .qml-toastmanager-top-left { top: 0; left: 0; align-items: flex-start; }
    .qml-toastmanager-bottom-right { bottom: 0; right: 0; align-items: flex-end; flex-direction: column-reverse; }
    .qml-toastmanager-bottom-left { bottom: 0; left: 0; align-items: flex-start; flex-direction: column-reverse; }
    .qml-toastmanager-item {
      pointer-events: auto;
      width: 320px;
      background: var(--ctp-base, #1e1e2e);
      border: 1px solid var(--ctp-surface1, #45475a);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex; gap: 10px; align-items: flex-start;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, sans-serif);
      animation: qml-tm-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .qml-toastmanager-icon { display: inline-flex; flex-shrink: 0; margin-top: 1px; }
    .qml-toastmanager-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .qml-toastmanager-title { font-weight: 600; font-size: 13px; color: var(--ctp-subtext1, #bac2de); }
    .qml-toastmanager-message { font-size: 13px; line-height: 1.4; word-wrap: break-word; }
    .qml-toastmanager-close {
      background: none; border: none; cursor: pointer;
      color: var(--ctp-overlay0, #6c7086);
      padding: 4px; border-radius: 4px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
      transition: color 120ms, background-color 120ms;
    }
    .qml-toastmanager-close:hover { color: var(--ctp-text, #cdd6f4); background: color-mix(in srgb, var(--ctp-text) 8%, transparent); }
    @keyframes qml-tm-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `],
})
export class ToastManager {
  position = input<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');

  protected readonly service = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  protected accentFor(type: ToastEntry['type']): string {
    switch (type) {
      case 'success': return 'var(--ctp-green, #a6e3a1)';
      case 'error': return 'var(--ctp-red, #f38ba8)';
      case 'warning': return 'var(--ctp-yellow, #f9e2af)';
      default: return 'var(--ctp-sky, #89dceb)';
    }
  }

  protected iconFor(type: ToastEntry['type']): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  }

  protected resolvedTitle(entry: ToastEntry): string {
    if (entry.title) return entry.title;
    switch (entry.type) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      default: return 'Informação';
    }
  }

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
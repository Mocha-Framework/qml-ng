// Refined manually. Do not overwrite.

import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Toast',
  standalone: true,
  template: `
    <div class="qml-toast" [class.exiting]="exiting()" [attr.data-type]="type()"
      [style.--qml-toast-accent]="accentColor()" (mouseenter)="pause()" (mouseleave)="resume()">
      <span class="qml-toast-icon" [style.color]="accentColor()" [innerHTML]="iconSvg(typeIcon(), 20)"></span>
      <div class="qml-toast-text">
        <div class="qml-toast-title">{{ resolvedTitle() }}</div>
        <div class="qml-toast-message">{{ message() }}</div>
      </div>
      @if (showClose()) {
        <button class="qml-toast-close" type="button" (click)="dismiss()" aria-label="Fechar">
          <span [innerHTML]="iconSvg('x', 16)"></span>
        </button>
      }
      <div class="qml-toast-progress">
        <div class="qml-toast-progress-bar" [style.width.%]="progress()"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 320px; }
    .qml-toast {
      position: relative;
      background: var(--ctp-base, #1e1e2e);
      border: 1px solid var(--ctp-surface1, #45475a);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex; gap: 10px; align-items: flex-start;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -6px rgba(0, 0, 0, 0.2);
      color: var(--ctp-text, #cdd6f4);
      font-family: var(--ctp-font-family, sans-serif);
      overflow: hidden;
      animation: qml-toast-in 250ms cubic-bezier(0.25, 1, 0.5, 1);
      transition: transform 120ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .qml-toast:hover { transform: scale(1.01); }
    .qml-toast.exiting { animation: qml-toast-out 220ms cubic-bezier(0.4, 0, 1, 1) forwards; }
    .qml-toast-icon { display: inline-flex; flex-shrink: 0; margin-top: 1px; }
    .qml-toast-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .qml-toast-title { font-weight: 600; font-size: 13px; color: var(--ctp-subtext1, #bac2de); line-height: 1.4; }
    .qml-toast-message { font-size: 13px; line-height: 1.4; word-wrap: break-word; }
    .qml-toast-close {
      background: none; border: none; cursor: pointer;
      color: var(--ctp-overlay0, #6c7086);
      padding: 4px; border-radius: 4px; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
      transition: color 120ms, background-color 120ms, transform 100ms;
      flex-shrink: 0;
    }
    .qml-toast-close:hover { color: var(--ctp-text, #cdd6f4); background: color-mix(in srgb, var(--ctp-text) 8%, transparent); transform: scale(1.08); }
    .qml-toast-progress {
      position: absolute; bottom: 6px; left: 16px; right: 16px;
      height: 4px; border-radius: 2px; background: var(--ctp-surface1, #45475a); overflow: hidden;
    }
    .qml-toast-progress-bar {
      height: 100%;
      background: var(--qml-toast-accent, var(--ctp-mauve));
      transition: width 80ms linear;
    }
    @keyframes qml-toast-in { from { transform: translateX(120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes qml-toast-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120px); opacity: 0; } }
  `],
})
export class Toast {
  title = input<string>('');
  message = input<string>('');
  type = input<'info' | 'success' | 'warning' | 'error'>('info');
  duration = input<number>(3000);
  showClose = input<boolean>(true);

  dismissed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);
  protected progress = signal(100);
  protected exiting = signal(false);
  private remaining = signal(3000);
  private timer: ReturnType<typeof setInterval> | null = null;
  private paused = false;
  private lastTick = 0;

  ngOnInit(): void { this.startTimer(); }
  ngOnDestroy(): void { this.clearTimer(); }

  private startTimer(): void {
    this.remaining.set(this.duration());
    this.lastTick = Date.now();
    this.timer = setInterval(() => this.tick(), 50);
  }

  private tick(): void {
    if (this.paused || this.exiting()) return;
    const now = Date.now();
    const dt = now - this.lastTick;
    this.lastTick = now;
    const next = Math.max(0, this.remaining() - dt);
    this.remaining.set(next);
    this.progress.set(Math.round((next / this.duration()) * 100));
    if (next <= 0) this.dismiss();
  }

  protected pause(): void {
    this.paused = true;
    this.lastTick = Date.now();
  }
  protected resume(): void {
    this.paused = false;
    this.lastTick = Date.now();
  }

  protected dismiss(): void {
    if (this.exiting()) return;
    this.exiting.set(true);
    this.clearTimer();
    setTimeout(() => this.dismissed.emit(), 220);
  }

  private clearTimer(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  protected accentColor = computed(() => {
    switch (this.type()) {
      case 'success': return 'var(--ctp-green, #a6e3a1)';
      case 'error': return 'var(--ctp-red, #f38ba8)';
      case 'warning': return 'var(--ctp-yellow, #f9e2af)';
      default: return 'var(--ctp-sky, #89dceb)';
    }
  });

  protected typeIcon = computed(() => {
    switch (this.type()) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  });

  protected resolvedTitle = computed(() => {
    const t = this.title();
    if (t) return t;
    switch (this.type()) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      default: return 'Informação';
    }
  });

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
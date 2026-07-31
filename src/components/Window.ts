// Refined manually. Do not overwrite.

import {
  Component, input, output, signal, computed, ElementRef, HostListener, inject,
} from '@angular/core';

type Edge = 'tl' | 'tr' | 'bl' | 'br' | 'left' | 'right' | 'top' | 'bottom';

interface SavedGeom { x: number; y: number; width: number; height: number; }

@Component({
  selector: 'Window',
  standalone: true,
  template: `
    <div class="qml-window" [style.--handle.px]="handleSize()">
      <div class="qml-window-border"></div>

      @if (showCaption()) {
        <div class="qml-window-caption" [style.height.px]="captionHeight()"
          [class.no-move]="__maximized()"
          (dblclick)="toggleMaximized()">
          <div class="qml-window-caption-bg" [style.background]="captionBackground()"></div>
          <div class="qml-window-caption-sep" [style.background]="borderColor()"></div>
          <div class="qml-window-caption-move" (mousedown)="startDrag($event)"></div>

          @if (icon()) {
            <span class="qml-window-icon" aria-hidden="true">{{ icon() }}</span>
          }
          <span class="qml-window-title" [style.color]="captionTextColor()">{{ titleText() }}</span>

          <div class="qml-window-controls">
            <button type="button" class="qml-window-btn" (click)="onMinimize()" aria-label="Minimize">−</button>
            <button type="button" class="qml-window-btn" (click)="toggleMaximized()" [attr.aria-label]="__maximized() ? 'Restore' : 'Maximize'">
              {{ __maximized() ? '❐' : '☐' }}
            </button>
            <button type="button" class="qml-window-btn qml-window-btn-close" (click)="onClose()" aria-label="Close">×</button>
          </div>
        </div>
      }

      <div class="qml-window-content" [style.height.%]="showCaption() ? 100 : 100">
        <ng-content></ng-content>
      </div>

      @if (resizable() && !__maximized()) {
        <div class="resize resize-tl" (mousedown)="onResizeStart($event, 'tl')"></div>
        <div class="resize resize-tr" (mousedown)="onResizeStart($event, 'tr')"></div>
        <div class="resize resize-bl" (mousedown)="onResizeStart($event, 'bl')"></div>
        <div class="resize resize-br" (mousedown)="onResizeStart($event, 'br')"></div>
        <div class="resize resize-left" (mousedown)="onResizeStart($event, 'left')"></div>
        <div class="resize resize-right" (mousedown)="onResizeStart($event, 'right')"></div>
        <div class="resize resize-top" (mousedown)="onResizeStart($event, 'top')"></div>
        <div class="resize resize-bottom" (mousedown)="onResizeStart($event, 'bottom')"></div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .qml-window {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-width: 400px;
      min-height: 300px;
      background: var(--ctp-base, #1e1e2e);
      color: var(--ctp-text, #cdd6f4);
      box-sizing: border-box;
      overflow: hidden;
    }
    .qml-window-border {
      position: absolute; inset: 0;
      pointer-events: none;
      border: 1px solid var(--ctp-surface1, #45475a);
      z-index: 9999;
      border-radius: 0;
    }
    .qml-window-caption {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      flex-shrink: 0;
      z-index: 9998;
      user-select: none;
    }
    .qml-window-caption-bg { position: absolute; inset: 0; }
    .qml-window-caption-sep { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; }
    .qml-window-caption-move { position: absolute; inset: 0; cursor: grab; }
    .no-move .qml-window-caption-move { cursor: default; }
    .qml-window-icon {
      position: relative;
      margin-left: 16px;
      font-size: 18px;
    }
    .qml-window-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: 500;
      max-width: 50%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .qml-window-controls {
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
      margin-right: 8px;
    }
    .qml-window-btn {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px; height: 36px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: inherit;
      transition: background-color 100ms;
    }
    .qml-window-btn:hover { background: var(--ctp-surface0, #313244); }
    .qml-window-btn-close:hover { background: var(--ctp-red, #f38ba8); color: var(--ctp-base, #1e1e2e); }

    .qml-window-content {
      position: relative;
      flex: 1;
      overflow: auto;
    }

    .resize {
      position: absolute;
      z-index: 10000;
      background: transparent;
    }
    .resize-tl { top: 0; left: 0; width: calc(var(--handle, 6px) * 3); height: calc(var(--handle, 6px) * 3); cursor: nwse-resize; }
    .resize-tr { top: 0; right: 0; width: calc(var(--handle, 6px) * 3); height: calc(var(--handle, 6px) * 3); cursor: nesw-resize; }
    .resize-bl { bottom: 0; left: 0; width: calc(var(--handle, 6px) * 3); height: calc(var(--handle, 6px) * 3); cursor: nesw-resize; }
    .resize-br { bottom: 0; right: 0; width: calc(var(--handle, 6px) * 3); height: calc(var(--handle, 6px) * 3); cursor: nwse-resize; }
    .resize-left { top: calc(var(--handle, 6px) * 3); left: 0; width: var(--handle, 6px); height: calc(100% - var(--handle, 6px) * 6); cursor: ew-resize; }
    .resize-right { top: calc(var(--handle, 6px) * 3); right: 0; width: var(--handle, 6px); height: calc(100% - var(--handle, 6px) * 6); cursor: ew-resize; }
    .resize-top { top: 0; left: calc(var(--handle, 6px) * 3); width: calc(100% - var(--handle, 6px) * 6); height: var(--handle, 6px); cursor: ns-resize; }
    .resize-bottom { bottom: 0; left: calc(var(--handle, 6px) * 3); width: calc(100% - var(--handle, 6px) * 6); height: var(--handle, 6px); cursor: ns-resize; }
  `],
})
export class Window {
  titleText = input<string>('');
  caption = input<string>('');
  icon = input<string>('');
  themeMode = input<string>('catppuccin');
  flavor = input<string>('mocha');
  showCaption = input<boolean>(true);
  resizable = input<boolean>(true);
  captionHeight = input<number>(44);
  handleSize = input<number>(6);
  captionBackground = input<string>('var(--ctp-mantle, #181825)');
  captionTextColor = input<string>('var(--ctp-text, #cdd6f4)');
  buttonHover = input<string>('var(--ctp-surface0, #313244)');
  buttonCloseHover = input<string>('var(--ctp-red, #f38ba8)');
  borderColor = input<string>('var(--ctp-surface1, #45475a)');
  minimumWidth = input<number>(400);
  minimumHeight = input<number>(300);

  minimized = output<void>();
  maximized = output<void>();
  restored = output<void>();
  closed = output<void>();

  protected readonly __maximized = signal(false);
  private readonly __savedGeom = signal<SavedGeom>({ x: 0, y: 0, width: 800, height: 600 });
  private __edge: Edge | null = null;
  private __sx = 0;
  private __sy = 0;
  private __sw = 0;
  private __sh = 0;
  private __mx = 0;
  private __my = 0;
  private __dragging = false;

  private readonly host = inject(ElementRef<HTMLElement>);

  protected startDrag(ev: MouseEvent): void {
    if (this.__maximized()) return;
    if (ev.button !== 0) return;
    this.__dragging = true;
    ev.preventDefault();
  }

  protected onResizeStart(ev: MouseEvent, edge: Edge): void {
    if (!this.resizable() || this.__maximized()) return;
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.__edge = edge;
    const el = this.host.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.__sx = rect.left;
    this.__sy = rect.top;
    this.__sw = rect.width;
    this.__sh = rect.height;
    this.__mx = ev.screenX;
    this.__my = ev.screenY;
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(ev: MouseEvent): void {
    if (this.__dragging) {
      this.host.nativeElement.style.opacity = '0.95';
      return;
    }
    if (!this.__edge) return;
    const dx = ev.screenX - this.__mx;
    const dy = ev.screenY - this.__my;
    let newX = this.__sx;
    let newY = this.__sy;
    let newW = this.__sw;
    let newH = this.__sh;
    const e = this.__edge;

    if (e === 'left' || e === 'tl' || e === 'bl') {
      newX = this.__sx + dx;
      newW = this.__sw - dx;
      if (newW < this.minimumWidth()) {
        newX = this.__sx + this.__sw - this.minimumWidth();
        newW = this.minimumWidth();
      }
    }
    if (e === 'right' || e === 'tr' || e === 'br') {
      newW = this.__sw + dx;
      if (newW < this.minimumWidth()) newW = this.minimumWidth();
    }
    if (e === 'top' || e === 'tl' || e === 'tr') {
      newY = this.__sy + dy;
      newH = this.__sh - dy;
      if (newH < this.minimumHeight()) {
        newY = this.__sy + this.__sh - this.minimumHeight();
        newH = this.minimumHeight();
      }
    }
    if (e === 'bottom' || e === 'bl' || e === 'br') {
      newH = this.__sh + dy;
      if (newH < this.minimumHeight()) newH = this.minimumHeight();
    }

    const el = this.host.nativeElement as HTMLElement;
    el.style.position = 'absolute';
    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;
    el.style.width = `${newW}px`;
    el.style.height = `${newH}px`;
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void {
    if (this.__dragging) {
      this.__dragging = false;
      const el = this.host.nativeElement as HTMLElement;
      el.style.opacity = '';
    }
    this.__edge = null;
  }

  protected toggleMaximized(): void {
    if (!this.resizable()) return;
    const el = this.host.nativeElement as HTMLElement;
    el.style.position = 'absolute';
    if (this.__maximized()) {
      this.restored.emit();
      this.__maximized.set(false);
      const g = this.__savedGeom();
      el.style.left = `${g.x}px`;
      el.style.top = `${g.y}px`;
      el.style.width = `${g.width}px`;
      el.style.height = `${g.height}px`;
    } else {
      this.maximized.emit();
      const rect = el.getBoundingClientRect();
      this.__savedGeom.set({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
      this.__maximized.set(true);
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = `${window.innerWidth}px`;
      el.style.height = `${window.innerHeight}px`;
    }
  }

  protected onMinimize(): void {
    this.minimized.emit();
    const el = this.host.nativeElement as HTMLElement;
    el.style.display = 'none';
  }

  protected onClose(): void {
    this.closed.emit();
  }
}

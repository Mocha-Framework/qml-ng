// Refined manually. Do not overwrite.

import { Component, input, output, model, HostListener } from '@angular/core';

@Component({
  selector: 'Modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="qml-modal-overlay" (click)="onBackdropClick($event)">
        <div class="qml-modal-container" [style.width.px]="finalWidth" [style.max-height.px]="finalMaxHeight" (click)="$event.stopPropagation()">
          @if (showCloseButton()) {
            <button class="qml-modal-close" (click)="onClose()">&times;</button>
          }
          @if (title() || subtitle()) {
            <div class="qml-modal-header">
              @if (title(); as t) { <h2 class="qml-modal-title">{{ t }}</h2> }
              @if (subtitle(); as s) { <p class="qml-modal-subtitle">{{ s }}</p> }
            </div>
          }
          <div class="qml-modal-body">
            <ng-content></ng-content>
          </div>
          <div class="qml-modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .qml-modal-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(10, 10, 15, 0.7);
      display: flex; align-items: center; justify-content: center;
      animation: qml-fade-in 0.15s ease-out;
    }
    .qml-modal-container {
      background: var(--qml-base, #1e1e2e); border-radius: 18px;
      border: 1px solid var(--qml-surface1, #45475a);
      display: flex; flex-direction: column; max-height: 90vh;
      animation: qml-modal-enter 0.25s ease-out; position: relative;
    }
    .qml-modal-close { position: absolute; top: 16px; right: 16px; z-index: 1;
      border: none; background: none; cursor: pointer; font-size: 20px;
      color: var(--qml-subtext0, #a6adc8); padding: 4px; line-height: 1; }
    .qml-modal-header { padding: 24px 24px 0; }
    .qml-modal-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--qml-text, #cdd6f4); }
    .qml-modal-subtitle { margin: 4px 0 0; font-size: 12px; color: var(--qml-subtext0, #a6adc8); }
    .qml-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
    .qml-modal-footer { padding: 0 24px 24px; display: flex; gap: 8px; justify-content: flex-end; }
    @keyframes qml-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes qml-modal-enter { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  `],
})
export class Modal {
  open = model<boolean>(false);
  title = input<string>('');
  subtitle = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');
  customWidth = input<number>(-1);
  customHeight = input<number>(-1);
  minHeight = input<number>(0);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  usePortal = input<boolean>(true);

  accepted = output<void>();
  rejected = output<void>();
  opened = output<void>();
  closed = output<void>();

  protected get finalWidth(): number {
    if (this.customWidth() > 0) return this.customWidth();
    const widths: Record<string, number> = { sm: 400, md: 600, lg: 800 };
    return widths[this.size()] ?? 600;
  }
  protected get finalMaxHeight(): number {
    return this.customHeight() > 0 ? this.customHeight() : 0;
  }
  @HostListener('document:keydown.escape')
  protected onEscape(): void { if (this.open() && this.closeOnEscape()) this.close(); }
  protected onClose(): void { this.close(); }
  protected onBackdropClick(_event: MouseEvent): void { if (this.closeOnBackdropClick()) this.close(); }
  private close(): void {
    this.open.set(false); this.rejected.emit(); this.closed.emit();
  }
}

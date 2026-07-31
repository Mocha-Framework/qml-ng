// Refined manually. Do not overwrite.

import { Component, input, output, computed, signal } from '@angular/core';

@Component({
  selector: 'InteractiveListCell',
  standalone: true,
  template: `
    <button
      type="button"
      class="qml-list-cell"
      [class.selected]="isSelected()"
      [style.background-color]="bgColor()"
      [style.border-color]="resolvedBorderColor()"
      [style.border-width.px]="borderWidth()"
      [style.border-radius.px]="radius()"
      [style.padding]="'calc(' + paddingVertical() + 'px * 1) calc(' + paddingHorizontal() + 'px * 1)'"
      [style.transform]="transform()"
      (click)="onClick()"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
      (mousedown)="onPress(true)"
      (mouseup)="onPress(false)">
      <div class="qml-list-cell-content">
        <ng-content></ng-content>
      </div>
    </button>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .qml-list-cell {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 48px;
      cursor: pointer;
      transition: background-color 150ms, border-color 150ms, transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
      border-style: solid;
    }
    .qml-list-cell:focus-visible {
      outline: 2px solid var(--ctp-mauve, #cba6f7);
      outline-offset: 2px;
    }
    .qml-list-cell-content { display: flex; align-items: center; width: 100%; gap: 12px; }
  `],
})
export class InteractiveListCell {
  rowContent = input<unknown>(undefined);
  isSelected = input<boolean>(false);
  cellModelData = input<unknown>(null);
  cellIndex = input<number>(-1);
  backgroundColor = input<string>('transparent');
  hoverColor = input<string>('rgba(49, 50, 68, 0.4)');
  pressedColor = input<string>('rgba(49, 50, 68, 0.8)');
  borderColor = input<string>('transparent');
  hoverBorderColor = input<string>('rgba(69, 71, 90, 0.5)');
  radius = input<number>(12);
  borderWidth = input<number>(1);
  paddingHorizontal = input<number>(12);
  paddingVertical = input<number>(8);

  clicked = output<void>();

  private readonly _hovered = signal(false);
  private readonly _pressed = signal(false);

  protected bgColor = computed(() => {
    if (this._pressed()) return this.pressedColor();
    if (this._hovered()) return this.hoverColor();
    if (this.isSelected()) return 'var(--ctp-surface0, #313244)';
    return this.backgroundColor();
  });

  protected resolvedBorderColor = computed(() => {
    if (this._hovered() || this.isSelected()) return this.hoverBorderColor();
    return this.borderColor();
  });

  protected transform = computed(() => {
    if (this._pressed()) return 'scale(0.985)';
    if (this._hovered()) return 'scale(1.005)';
    return 'scale(1)';
  });

  protected onEnter(): void { this._hovered.set(true); }
  protected onLeave(): void { this._hovered.set(false); this._pressed.set(false); }
  protected onPress(v: boolean): void { this._pressed.set(v); }
  protected onClick(): void { this.clicked.emit(); }
}

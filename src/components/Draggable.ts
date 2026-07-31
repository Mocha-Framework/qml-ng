// Refined manually. Do not overwrite.

import {
  Component, input, output, signal, inject, ElementRef, HostListener,
} from '@angular/core';
import { DragRegistryService } from '../shared/drag-registry.service';

@Component({
  selector: 'Draggable',
  standalone: true,
  template: `
    <div class="qml-draggable"
      [class.is-hovered]="_hovered()"
      [class.is-active]="_active()"
      [style.--qml-drag-radius.px]="radius() >= 0 ? radius() : 12"
      (mousedown)="onMouseDown($event)"
      (click)="onClick($event)">
      @if (_active()) {
        <div class="qml-draggable-shadow"></div>
      }
      <div class="qml-draggable-content"
        [style.transform]="_active()
          ? 'scale(' + dragScale() + ') rotate(' + dragRotation() + 'deg)'
          : (_hovered() ? 'scale(1.02)' : 'scale(1)')"
        [style.opacity]="_active() ? dragOpacity() : 1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: inline-block; position: relative; }
    .qml-draggable {
      position: relative;
      display: inline-block;
      cursor: grab;
      transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 0;
    }
    .qml-draggable.is-active { cursor: grabbing; z-index: 100; }
    .qml-draggable-content {
      display: block;
      transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1),
                  opacity 120ms ease;
      transform-origin: center;
    }
    .qml-draggable-shadow {
      position: absolute;
      inset: -6px;
      border-radius: var(--qml-drag-radius, 12px);
      pointer-events: none;
      transition: opacity 140ms ease;
      box-shadow:
        0 4px 0 0 rgba(0,0,0,0.25),
        0 8px 0 -3px rgba(0,0,0,0.12);
    }
  `],
})
export class Draggable {
  key = input<string>('');
  dragData = input<unknown>(null);
  threshold = input<number>(8);
  dragScale = input<number>(1.05);
  dragOpacity = input<number>(0.9);
  dragRotation = input<number>(3.5);
  elevation = input<number>(6);
  radius = input<number>(-1);
  moves = input<boolean>(false);
  axis = input<number>(3);

  dragStarted = output<{ data: unknown }>();
  dragEnded = output<{ data: unknown }>();
  clicked = output<void>();

  protected readonly _hovered = signal(false);
  protected readonly _active = signal(false);
  private readonly registry = inject(DragRegistryService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly sourceId = this.registry.nextId();
  private dragStartX = 0;
  private dragStartY = 0;
  private pressed = false;

  protected onMouseDown(ev: MouseEvent): void {
    if (ev.button !== 0) return;
    this.dragStartX = ev.clientX;
    this.dragStartY = ev.clientY;
    this.pressed = true;
    this._hovered.set(true);
  }

  protected onClick(_ev: MouseEvent): void {
    if (this._active()) return;
    this.clicked.emit();
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(ev: MouseEvent): void {
    if (!this.pressed) return;
    if (!this._active()) {
      const dx = Math.abs(ev.clientX - this.dragStartX);
      const dy = Math.abs(ev.clientY - this.dragStartY);
      if (dx >= this.threshold() || dy >= this.threshold()) {
        this._active.set(true);
        this.registry.startDrag({
          key: this.key(),
          data: this.dragData(),
          sourceId: this.sourceId,
          startX: this.dragStartX,
          startY: this.dragStartY,
        });
        this.dragStarted.emit({ data: this.dragData() });
      }
    } else {
      this.registry.updateDrag(ev.clientX, ev.clientY);
    }
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void {
    if (this._active()) {
      this.registry.endDrag();
      this.dragEnded.emit({ data: this.dragData() });
    }
    this.pressed = false;
    this._hovered.set(false);
    this._active.set(false);
  }

  @HostListener('window:mouseleave')
  protected onMouseLeave(): void {
    if (!this._active()) this._hovered.set(false);
  }
}

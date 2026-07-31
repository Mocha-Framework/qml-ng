// Refined manually. Do not overwrite.

import {
  Component, input, output, signal, computed, effect, inject, ElementRef,
  HostListener, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DragRegistryService } from '../shared/drag-registry.service';

interface SortItem { data: unknown; id: string; }

@Component({
  selector: 'SortableList',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="qml-sortable" [style.gap.px]="spacing()"
      [style.padding]="paddingStyle()"
      [style.overflow]="clip() ? 'hidden' : 'visible'">
      @for (item of items(); track item.id; let i = $index) {
        <div class="qml-sortable-item"
          [class.is-held]="heldIndex() === i"
          [class.is-target]="dragTargetIndex() === i && heldIndex() !== i"
          [style.opacity]="heldIndex() === i ? 0.35 : 1"
          [style.transform]="heldIndex() === i ? 'scale(1.02)' : 'scale(1)'"
          [style.transition]="'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 120ms ease'"
          (mousedown)="onItemMouseDown($event, i)">
          @if (delegate(); as tpl) {
            <ng-container *ngTemplateOutlet="tpl; context: { $implicit: item.data, index: i, modelData: item.data }"></ng-container>
          } @else {
            <span class="qml-sortable-fallback">{{ stringifyItem(item.data) }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .qml-sortable {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    .qml-sortable-item {
      position: relative;
      padding: 8px;
      border-radius: 12px;
      cursor: grab;
      transition: background-color 150ms, border-color 150ms;
    }
    .qml-sortable-item:hover { background: rgba(54, 58, 79, 0.3); }
    .qml-sortable-item.is-held { z-index: 100; cursor: grabbing; }
    .qml-sortable-item.is-target {
      background: rgba(203, 166, 247, 0.2);
      border: 2px solid var(--ctp-mauve, #cba6f7);
    }
    .qml-sortable-fallback {
      color: var(--ctp-text, #cdd6f4);
      font-size: 14px;
    }
  `],
})
export class SortableList {
  model = input<unknown[]>([]);
  delegate = input<TemplateRef<unknown> | null>(null);
  spacing = input<number>(8);
  paddingLeft = input<number>(4);
  paddingRight = input<number>(4);
  paddingTop = input<number>(4);
  paddingBottom = input<number>(4);
  listId = input<string>('');
  dragKey = input<string>('mochads-sortable');
  sortable = input<boolean>(true);
  clip = input<boolean>(true);

  itemsReordered = output<{ fromIndex: number; toIndex: number }>();
  externalItemDropped = output<{ source: unknown; insertIndex: number }>();

  protected readonly _items = signal<SortItem[]>([]);
  protected readonly heldIndex = signal<number>(-1);
  protected readonly dragTargetIndex = signal<number>(-1);
  protected readonly isDragging = signal<boolean>(false);

  protected items = computed(() => this._items());

  protected paddingStyle = computed(() =>
    `${this.paddingTop()}px ${this.paddingRight()}px ${this.paddingBottom()}px ${this.paddingLeft()}px`);

  private readonly registry = inject(DragRegistryService);
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const m = this.model();
      if (Array.isArray(m)) {
        this._items.set(m.map((d, i) => ({
          data: d,
          id: `item-${i}-${(typeof d === 'object' && d !== null ? JSON.stringify(d) : String(d)).slice(0, 16)}`,
        })));
      } else {
        this._items.set([]);
      }
    });

    effect(() => {
      const active = this.registry.active();
      if (!active && this.heldIndex() !== -1) {
        const from = this.heldIndex();
        const to = this.dragTargetIndex();
        this.heldIndex.set(-1);
        this.isDragging.set(false);
        this.dragTargetIndex.set(-1);
        if (from >= 0 && to >= 0 && to !== from) {
          const list = this._items().slice();
          const [moved] = list.splice(from, 1);
          list.splice(to, 0, moved);
          this._items.set(list);
          this.itemsReordered.emit({ fromIndex: from, toIndex: to });
        }
      }
    });
  }

  protected onItemMouseDown(ev: MouseEvent, index: number): void {
    if (!this.sortable()) return;
    if (ev.button !== 0) return;
    this.heldIndex.set(index);
    this.isDragging.set(true);
    this.registry.startDrag({
      key: this.dragKey(),
      data: { __sourceListId: this.listId(), __sourceIndex: index },
      sourceId: `sortable-${this.listId()}-${index}`,
      startX: ev.clientX,
      startY: ev.clientY,
    });
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(ev: MouseEvent): void {
    if (this.heldIndex() === -1) return;
    this.registry.updateDrag(ev.clientX, ev.clientY);
    const rects = this.collectItemRects();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (ev.clientY >= r.top && ev.clientY <= r.top + r.height) {
        if (this.dragTargetIndex() !== i) this.dragTargetIndex.set(i);
        break;
      }
    }
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void {
    if (this.heldIndex() !== -1) {
      this.registry.endDrag();
    }
  }

  protected stringifyItem(data: unknown): string {
    if (data === null || data === undefined) return '';
    if (typeof data === 'object') return JSON.stringify(data);
    return String(data);
  }

  private collectItemRects(): { top: number; height: number; }[] {
    const root = this.host.nativeElement as HTMLElement;
    const els = root.querySelectorAll('.qml-sortable-item');
    return Array.from(els).map((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      return { top: r.top, height: r.height };
    });
  }
}

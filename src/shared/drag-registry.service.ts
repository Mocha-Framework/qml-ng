// Refined manually. Do not overwrite.
//
// DragRegistryService: lightweight shared service used by Draggable + DropZone
// to coordinate drag state without @angular/cdk.

import { Injectable, signal } from '@angular/core';

export interface DragPayload {
  key: string;
  data: unknown;
  sourceId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

@Injectable({ providedIn: 'root' })
export class DragRegistryService {
  private readonly _active = signal<DragPayload | null>(null);
  readonly active = this._active.asReadonly();

  private _idCounter = 0;

  startDrag(payload: Omit<DragPayload, 'currentX' | 'currentY'>): void {
    this._active.set({ ...payload, currentX: payload.startX, currentY: payload.startY });
  }

  updateDrag(x: number, y: number): void {
    const cur = this._active();
    if (!cur) return;
    this._active.set({ ...cur, currentX: x, currentY: y });
  }

  endDrag(): DragPayload | null {
    const cur = this._active();
    this._active.set(null);
    return cur;
  }

  nextId(): string {
    this._idCounter++;
    return `drag-${this._idCounter}`;
  }
}

// Refined manually. Do not overwrite.

import {
  Component, input, output, signal, computed, effect, inject, ElementRef, HostListener,
} from '@angular/core';
import { DragRegistryService } from '../shared/drag-registry.service';

@Component({
  selector: 'DropZone',
  standalone: true,
  template: `
    <div class="qml-dropzone" [class.is-active]="isActive()"
      [style.--qml-dz-radius.px]="radius()"
      [style.--qml-dz-accent]="accentColor() || 'var(--ctp-mauve, #cba6f7)'">
      <div class="qml-dropzone-fill" [style.opacity]="isActive() ? highlightOpacity() : 0"></div>
      <div class="qml-dropzone-border" [style.opacity]="isActive() ? borderOpacity() : 0"></div>
      <div class="qml-dropzone-content"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    :host { display: block; position: relative; }
    .qml-dropzone {
      position: relative;
      border-radius: var(--qml-dz-radius, 12px);
    }
    .qml-dropzone-fill {
      position: absolute; inset: 0;
      background: var(--qml-dz-accent, var(--ctp-mauve, #cba6f7));
      border-radius: var(--qml-dz-radius, 12px);
      transition: opacity 150ms ease;
      pointer-events: none;
    }
    .qml-dropzone-border {
      position: absolute; inset: 0;
      border: 2px solid var(--qml-dz-accent, var(--ctp-mauve, #cba6f7));
      border-radius: var(--qml-dz-radius, 12px);
      transition: opacity 150ms ease;
      pointer-events: none;
    }
    .qml-dropzone-content { position: relative; z-index: 1; }
  `],
})
export class DropZone {
  key = input<string>('');
  accentColor = input<string>('');
  highlightOpacity = input<number>(0.15);
  borderOpacity = input<number>(0.4);
  radius = input<number>(12);
  forceHighlight = input<boolean>(false);

  entered = output<{ source: unknown }>();
  exited = output<{ source: unknown }>();
  dropped = output<{ source: unknown }>();

  protected readonly _containsDrag = signal(false);
  protected readonly isActive = computed(() => this._containsDrag() || this.forceHighlight());

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly registry = inject(DragRegistryService);
  private lastSource: unknown = null;

  constructor() {
    effect(() => {
      const active = this.registry.active();
      if (!active) {
        if (this._containsDrag()) {
          this._containsDrag.set(false);
          this.exited.emit({ source: this.lastSource });
          this.lastSource = null;
        }
        return;
      }
      if (this.key() && active.key !== this.key()) {
        if (this._containsDrag()) {
          this._containsDrag.set(false);
          this.exited.emit({ source: this.lastSource });
          this.lastSource = null;
        }
        return;
      }
      const rect = (this.host.nativeElement as HTMLElement).getBoundingClientRect();
      const inside = active.currentX >= rect.left && active.currentX <= rect.right
        && active.currentY >= rect.top && active.currentY <= rect.bottom;
      if (inside && !this._containsDrag()) {
        this._containsDrag.set(true);
        this.lastSource = active.data;
        this.entered.emit({ source: active.data });
      } else if (!inside && this._containsDrag()) {
        this._containsDrag.set(false);
        this.exited.emit({ source: this.lastSource });
        this.lastSource = null;
      }
    });
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void {
    if (this._containsDrag()) {
      const active = this.registry.active();
      if (active) {
        this.dropped.emit({ source: active.data });
      }
      this._containsDrag.set(false);
      this.lastSource = null;
    }
  }
}

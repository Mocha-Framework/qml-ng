// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'MochaMap',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="qml-mocha-map" [class]="layout()" [style.gap.px]="spacing()">
      @for (item of itemsArray(); track $index; let idx = $index) {
        <div class="qml-mocha-map-item" [attr.data-index]="idx">
          <ng-container *ngTemplateOutlet="itemTpl; context: { $implicit: item, index: idx }"></ng-container>
        </div>
      }
    </div>
    <ng-template #itemTpl let-item let-i="index">
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    .qml-mocha-map { display: flex; width: 100%; flex-wrap: nowrap; }
    .vertical { flex-direction: column; }
    .horizontal { flex-direction: row; }
    .qml-mocha-map-item { display: block; }
  `],
})
export class MochaMap {
  items = input<unknown[]>([]);
  delegate = input<unknown>(null);
  spacing = input<number>(0);
  orientation = input<string>('vertical');

  protected itemsArray = computed<unknown[]>(() => {
    const v = this.items();
    return Array.isArray(v) ? v : [];
  });

  protected layout = computed(() => this.orientation() === 'horizontal' ? 'horizontal' : 'vertical');
}

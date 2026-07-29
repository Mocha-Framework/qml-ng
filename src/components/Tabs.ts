// Refined manually. Do not overwrite.

import { Component, input, output, computed, model } from '@angular/core';

interface TabItem { id: string; label: string; icon: string; }

@Component({
  selector: 'Tabs',
  standalone: true,
  template: `
    <div class="qml-tabs" [class]="'qml-tabs-' + variant()" [style.--qml-accent]="finalAccentColor()">
      <div class="qml-tabs-list" role="tablist">
        @for (tab of tabsList(); track tab.id; let i = $index) {
          <button class="qml-tabs-trigger" [class.active]="i === currentIndex()"
            (click)="selectTab(i)" role="tab" [attr.aria-selected]="i === currentIndex()">
            @if (tab.icon) { <qml-icon [name]="tab.icon" size="16" /> }
            {{ tab.label }}
          </button>
        }
        <div class="qml-tabs-highlight"></div>
      </div>
      <div class="qml-tabs-content"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .qml-tabs { display: flex; flex-direction: column; width: 100%; }
    .qml-tabs-list { display: flex; gap: 0; position: relative; overflow: hidden; }
    .qml-tabs-trigger { padding: 8px 16px; cursor: pointer; border: none; background: transparent;
      font-family: inherit; font-size: 14px; white-space: nowrap; color: var(--qml-subtext0, #a6adc8); }
    .qml-tabs-trigger.active { color: var(--qml-accent, #cba6f7); font-weight: 600; }
    .qml-tabs.qml-tabs-pill .qml-tabs-trigger.active { background: var(--qml-accent, #cba6f7);
      color: var(--qml-crust, #11111b); border-radius: 6px; }
    .qml-tabs-content { padding: 16px 0; }
  `],
})
export class Tabs {
  model = input<unknown[]>([]);
  currentIndex = model<number>(0);
  variant = input<'line' | 'pill' | 'segmented' | 'card'>('line');
  customAccentColor = input<string>('transparent');
  customTextColor = input<string>('transparent');
  sortable = input<boolean>(false);
  tabSelected = output<{ index: number; tabId: string }>();
  tabsReordered = output<{ fromIndex: number; toIndex: number }>();

  protected tabsList = computed<TabItem[]>(() => {
    const m = this.model(); if (!Array.isArray(m)) return [];
    return m.map((item: unknown, idx: number) => {
      if (typeof item === 'string') return { id: item, label: item, icon: '' };
      const obj = item as Record<string, unknown>;
      return { id: String(obj['id'] ?? idx), label: String(obj['label'] ?? ''), icon: String(obj['icon'] ?? '') };
    });
  });
  protected finalAccentColor = computed(() =>
    this.customAccentColor() && this.customAccentColor() !== 'transparent'
      ? this.customAccentColor() : '#cba6f7');
  protected selectTab(index: number): void {
    this.currentIndex.set(index);
    const tab = this.tabsList()[index];
    if (tab) this.tabSelected.emit({ index, tabId: tab.id });
  }
}

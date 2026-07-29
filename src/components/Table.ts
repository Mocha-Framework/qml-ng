// Refined manually. Do not overwrite.

import { Component, input, output, model, computed } from '@angular/core';

interface TableColumn { key: string; label: string; sortable?: boolean; width?: number; }

@Component({
  selector: 'qml-table',
  standalone: true,
  template: `
    <table class="qml-table">
      @if (title(); as t) { <caption>{{ t }}</caption> }
      <thead><tr>
        @for (col of resolvedColumns(); track col.key) {
          <th [style.width.px]="col.width" [class.sortable]="col.sortable" [class.sorted]="sortKey() === col.key"
            (click)="handleSort(col)">{{ col.label }}{{ sortKey() === col.key ? (sortDesc() ? ' ▼' : ' ▲') : '' }}</th>
        }
      </tr></thead>
      <tbody>
        @for (row of sortedData(); track trackBy ? row[trackBy] : $index) {
          <tr [class.selected]="selectedKey() === (trackBy ? row[trackBy] : $index)"
            (click)="handleRowClick(row, $index)">
            @for (col of resolvedColumns(); track col.key) {
              <td>{{ row[col.key] }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .qml-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .qml-table th { padding: 12px 16px; font-weight: 600; text-align: left; white-space: nowrap;
      background: var(--qml-mantle, #181825); color: var(--qml-text, #cdd6f4); }
    .qml-table th.sortable { cursor: pointer; user-select: none; }
    .qml-table th.sortable:hover { color: var(--qml-mauve, #cba6f7); }
    .qml-table th.sorted { color: var(--qml-mauve, #cba6f7); }
    .qml-table td { padding: 12px 16px; border-top: 1px solid var(--qml-surface0, #313244); color: var(--qml-subtext0, #a6adc8); }
    .qml-table tbody tr:hover { background: var(--qml-surface0, #313244); }
    .qml-table tbody tr.selected { background: color-mix(in srgb, var(--qml-mauve, #cba6f7) 15%, transparent); }
  `],
})
export class Table {
  columns = input<TableColumn[]>([]); data = input<Record<string, unknown>[]>([]);
  title = input<string>(''); subtitle = input<string>(''); trackBy = input<string>('');
  selectedKey = model<string | number | null>(null);
  sortKey = model<string>(''); sortDesc = model<boolean>(false);
  rowClick = output<{ row: Record<string, unknown>; index: number }>();
  sortChange = output<{ key: string; desc: boolean }>();
  protected resolvedColumns = computed(() => {
    if (this.columns().length > 0) return this.columns();
    const rows = this.data(); if (rows.length === 0) return [];
    return Object.keys(rows[0]).map(k => ({ key: k, label: k }));
  });
  protected sortedData = computed(() => {
    const rows = [...this.data()]; const key = this.sortKey(); if (!key) return rows;
    return rows.sort((a, b) => { const c = String(a[key] ?? '').localeCompare(String(b[key] ?? '')); return this.sortDesc() ? -c : c; });
  });
  protected handleSort(col: TableColumn): void {
    if (!col.sortable) return;
    if (this.sortKey() === col.key) { this.sortDesc.update(v => !v); }
    else { this.sortKey.set(col.key); this.sortDesc.set(false); }
    this.sortChange.emit({ key: this.sortKey(), desc: this.sortDesc() });
  }
  protected handleRowClick(row: Record<string, unknown>, index: number): void {
    this.selectedKey.set(this.trackBy() ? String(row[this.trackBy()]) : String(index));
    this.rowClick.emit({ row, index });
  }
}

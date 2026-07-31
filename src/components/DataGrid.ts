// Refined manually. Do not overwrite.

import { Component, input, output, computed, signal } from '@angular/core';

export interface GridColumn { key: string; label: string; width?: number; align?: 'left' | 'center' | 'right'; sortable?: boolean; }
export interface GridRow { [key: string]: any; }

@Component({
  selector: 'DataGrid',
  standalone: true,
  template: `
    <div class="qml-datagrid" [class.loading]="loading()">
      @if (title(); as t) { <div class="qml-datagrid-title">{{ t }}</div> }
      <div class="qml-datagrid-table">
        <div class="qml-datagrid-header">
          @for (col of columns(); track col.key) {
            <div class="qml-datagrid-th" [attr.data-align]="col.align || 'left'" [style.width.px]="col.width"
              [class.sortable]="col.sortable" (click)="col.sortable && toggleSort(col.key)">
              {{ col.label }}
              @if (col.sortable && sortKey() === col.key) { <span class="qml-datagrid-sort">{{ sortDir() === 'asc' ? '↑' : '↓' }}</span> }
            </div>
          }
        </div>
        @if (loading()) {
          <div class="qml-datagrid-skeleton">
            @for (r of [1,2,3,4,5]; track r) {
              <div class="qml-datagrid-row-skeleton">
                @for (col of columns(); track col.key) {
                  <div class="qml-datagrid-cell-skel" [style.width.px]="col.width"></div>
                }
              </div>
            }
          </div>
        } @else if (paginatedRows().length === 0) {
          <div class="qml-datagrid-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <h3>Nenhum resultado</h3>
            <p>{{ emptyMessage() }}</p>
          </div>
        } @else {
          <div class="qml-datagrid-body">
            @for (row of paginatedRows(); track $index; let i = $index) {
              <div class="qml-datagrid-row" [class.alt]="i % 2 === 1" (click)="rowClicked.emit(row)">
                @for (col of columns(); track col.key) {
                  <div class="qml-datagrid-td" [attr.data-align]="col.align || 'left'" [style.width.px]="col.width">
                    {{ row[col.key] }}
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
      @if (rows().length > pageSize()) {
        <div class="qml-datagrid-pagination">
          <button class="qml-datagrid-page-btn" (click)="prevPage()" [disabled]="page() === 0">‹ Anterior</button>
          <span class="qml-datagrid-page-info">{{ page() + 1 }} / {{ totalPages() }}</span>
          <button class="qml-datagrid-page-btn" (click)="nextPage()" [disabled]="page() >= totalPages() - 1">Próximo ›</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-datagrid { width: 100%; background: var(--ctp-surface0, #313244); border: 1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent);
      border-radius: 16px; overflow: hidden; }
    .qml-datagrid-title { font-size: 0.95rem; font-weight: 700; color: var(--ctp-text, #cdd6f4); padding: 16px 20px;
      border-bottom: 1px solid var(--ctp-surface1, #45475a); }
    .qml-datagrid-table { overflow-x: auto; }
    .qml-datagrid-header, .qml-datagrid-row { display: flex; min-width: fit-content; }
    .qml-datagrid-header { background: var(--ctp-surface1, #45475a); border-bottom: 1px solid var(--ctp-overlay0, #6e738d); }
    .qml-datagrid-th { padding: 12px 14px; font-size: 0.78rem; font-weight: 700; color: var(--ctp-subtext1, #bac2de);
      text-transform: uppercase; letter-spacing: 0.05em; user-select: none; flex-shrink: 0; }
    .qml-datagrid-th[data-align="center"] { text-align: center; justify-content: center; }
    .qml-datagrid-th[data-align="right"] { text-align: right; justify-content: flex-end; }
    .qml-datagrid-th.sortable { cursor: pointer; }
    .qml-datagrid-th.sortable:hover { color: var(--ctp-text, #cdd6f4); }
    .qml-datagrid-sort { margin-left: 4px; color: var(--ctp-mauve, #cba6f7); }
    .qml-datagrid-row { border-bottom: 1px solid var(--ctp-surface1, #45475a); transition: background-color 0.15s ease; cursor: pointer; }
    .qml-datagrid-row:hover { background: var(--ctp-surface1, #45475a); }
    .qml-datagrid-row.alt { background: color-mix(in srgb, var(--ctp-surface0) 50%, var(--ctp-surface1)); }
    .qml-datagrid-td { padding: 12px 14px; font-size: 0.85rem; color: var(--ctp-text, #cdd6f4); flex-shrink: 0;
      display: flex; align-items: center; }
    .qml-datagrid-td[data-align="center"] { justify-content: center; }
    .qml-datagrid-td[data-align="right"] { justify-content: flex-end; }
    .qml-datagrid-empty { display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 48px 20px; color: var(--ctp-overlay0, #6e738d); text-align: center; }
    .qml-datagrid-empty h3 { margin: 0; font-size: 1rem; color: var(--ctp-text, #cdd6f4); }
    .qml-datagrid-empty p { margin: 0; font-size: 0.85rem; }
    .qml-datagrid-skeleton { padding: 8px 0; }
    .qml-datagrid-row-skeleton { display: flex; min-width: fit-content; padding: 12px 14px;
      border-bottom: 1px solid var(--ctp-surface1, #45475a); }
    .qml-datagrid-cell-skel { height: 16px; border-radius: 4px; margin-right: 12px;
      background: linear-gradient(90deg, var(--ctp-surface1) 25%, var(--ctp-surface2) 50%, var(--ctp-surface1) 75%);
      background-size: 200% 100%; animation: qml-skel-shimmer 1.5s ease-in-out infinite; flex-shrink: 0; }
    @keyframes qml-skel-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .qml-datagrid-pagination { display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-top: 1px solid var(--ctp-surface1, #45475a); background: var(--ctp-mantle, #181825); }
    .qml-datagrid-page-btn { background: none; border: 1px solid var(--ctp-surface1, #45475a); color: var(--ctp-text, #cdd6f4);
      padding: 5px 12px; border-radius: 6px; font-size: 0.8rem; font-family: inherit; cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease; }
    .qml-datagrid-page-btn:hover:not(:disabled) { background: var(--ctp-surface0, #313244); border-color: var(--ctp-mauve, #cba6f7); }
    .qml-datagrid-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .qml-datagrid-page-info { font-size: 0.82rem; color: var(--ctp-subtext0, #a6adc8); font-family: monospace; }
  `],
})
export class DataGrid {
  columns = input<GridColumn[]>([]);
  rows = input<GridRow[]>([]);
  title = input<string>('');
  loading = input<boolean>(false);
  emptyMessage = input<string>('Não há dados para exibir.');
  pageSize = input<number>(10);

  rowClicked = output<GridRow>();

  protected page = signal(0);
  protected sortKey = signal<string>('');
  protected sortDir = signal<'asc' | 'desc'>('asc');

  protected sortedRows = computed(() => {
    const k = this.sortKey(); const dir = this.sortDir();
    if (!k) return this.rows();
    return [...this.rows()].sort((a, b) => {
      const av = a[k]; const bv = b[k];
      if (av == null) return 1; if (bv == null) return -1;
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  protected totalPages = computed(() => Math.max(1, Math.ceil(this.sortedRows().length / this.pageSize())));

  protected paginatedRows = computed(() => {
    const start = this.page() * this.pageSize();
    return this.sortedRows().slice(start, start + this.pageSize());
  });

  protected toggleSort(key: string): void {
    if (this.sortKey() === key) this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    else { this.sortKey.set(key); this.sortDir.set('asc'); }
  }

  protected prevPage(): void { this.page.update(p => Math.max(0, p - 1)); }
  protected nextPage(): void { this.page.update(p => Math.min(this.totalPages() - 1, p + 1)); }
}

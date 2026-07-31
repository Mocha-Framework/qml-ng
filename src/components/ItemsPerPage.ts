// Refined manually. Do not overwrite.

import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'ItemsPerPage',
  standalone: true,
  template: `
    <label class="qml-items-per-page" [attr.data-size]="size()" [class.disabled]="disabled()">
      <span>Exibir:</span>
      <select [disabled]="disabled()" [value]="pageSize()" (change)="changeSize($event)">
        @for (option of options(); track option) { <option [value]="option">{{ option }}</option> }
      </select>
    </label>
  `,
  styles: [`
    .qml-items-per-page { display:inline-flex; align-items:center; gap:8px; color:var(--ctp-subtext0, #a6adc8); font:14px var(--ctp-font-family, sans-serif); transition:opacity 150ms; }
    .qml-items-per-page[data-size="sm"] { gap:8px; font-size:12px; }
    .qml-items-per-page.disabled { opacity:.6; }
    select { width:85px; height:38px; appearance:none; border:1px solid var(--ctp-surface1, #45475a); border-radius:8px; padding:0 28px 0 10px; color:var(--ctp-text, #cdd6f4); background:var(--ctp-surface0, #313244) no-repeat right 8px center/12px; cursor:pointer; font:inherit; }
    [data-size="sm"] select { width:75px; height:30px; } [data-size="lg"] select { width:95px; height:46px; }
    select:focus-visible { outline:2px solid color-mix(in srgb, var(--ctp-primary, #cba6f7) 45%, transparent); outline-offset:1px; }
  `],
})
export class ItemsPerPage {
  pageSize = model<number>(10);
  options = input<number[]>([10, 20, 50, 100]);
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('sm');
  pageSizeChanged = output<number>();
  protected changeSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(value); this.pageSizeChanged.emit(value);
  }
}

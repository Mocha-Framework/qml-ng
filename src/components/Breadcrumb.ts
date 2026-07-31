// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

interface BreadcrumbItem { label: string; onClicked?: () => void; }

@Component({
  selector: 'Breadcrumb',
  standalone: true,
  template: `
    <nav class="qml-breadcrumb" [class.qml-breadcrumb-md]="size() === 'md'" aria-label="Breadcrumb">
      @for (item of items(); track $index; let last = $last) {
        <button type="button" class="qml-breadcrumb-item" [class.current]="last" [disabled]="last || !item.onClicked" (click)="activate(item)">{{ item.label }}</button>
        @if (!last) { <qml-icon class="qml-breadcrumb-separator" [name]="separator()" [size]="size() === 'sm' ? 12 : 14" /> }
      }
    </nav>
  `,
  styles: [`
    .qml-breadcrumb { display:flex; align-items:center; gap:8px; font:12px var(--ctp-font-family, sans-serif); }
    .qml-breadcrumb-md { font-size:14px; }
    .qml-breadcrumb-item { appearance:none; padding:0; border:0; background:transparent; color:var(--ctp-primary, #cba6f7); font:inherit; cursor:pointer; }
    .qml-breadcrumb-item.current { color:var(--ctp-text, #cdd6f4); font-weight:700; cursor:default; }
    .qml-breadcrumb-item:disabled { opacity:1; }
    .qml-breadcrumb-separator { color:var(--ctp-overlay0, #6c7086); display:inline-flex; }
  `],
})
export class Breadcrumb {
  items = input<BreadcrumbItem[]>([]);
  separator = input<string>('chevron-right');
  size = input<'sm' | 'md'>('sm');
  protected activate(item: BreadcrumbItem): void { item.onClicked?.(); }
}

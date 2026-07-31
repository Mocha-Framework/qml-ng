// Refined manually. Do not overwrite.

import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'CozyList', standalone: true,
  template: `
    <div class="qml-cozy-list" [style.padding]="padding()" [style.gap.px]="spacing()">
      @if (isLoading()) {
        @for (_ of skeletons; track $index) { <div class="skeleton"><i></i><span></span><b></b></div> }
      } @else if (isEmpty()) {
        <div class="empty"><qml-icon [name]="emptyStateIcon()" size="48" /><strong>{{ emptyStateTitle() }}</strong>@if (emptyStateSubtitle()) { <small>{{ emptyStateSubtitle() }}</small> }</div>
      } @else {
        @for (item of items(); track $index; let i = $index) {
          <button class="row" [class.dragging]="dragIndex() === i" [draggable]="sortable()" (click)="itemClicked.emit({ modelData:item })" (dragstart)="dragIndex.set(i)" (dragover)="$event.preventDefault()" (drop)="drop(i)" (dragend)="dragIndex.set(-1)">
            <ng-container>{{ label(item) }}</ng-container>
          </button>
        }
      }
    </div>
  `,
  styles: [`
    :host { display:block; width:350px; height:400px; } .qml-cozy-list { width:100%; height:100%; box-sizing:border-box; display:flex; flex-direction:column; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--ctp-surface1, #45475a) transparent; font-family:var(--ctp-font-family, sans-serif); }
    .row { width:100%; min-height:44px; flex:none; box-sizing:border-box; padding:0 12px; border:0; border-radius:8px; text-align:left; color:var(--ctp-text, #cdd6f4); background:transparent; cursor:pointer; transition:transform 120ms, opacity 120ms, background 150ms; } .row:hover { background:var(--ctp-surface0, #313244); } .row.dragging { opacity:.85; transform:scale(1.03); }
    .empty { margin:auto; width:min(320px, calc(100% - 64px)); display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--ctp-subtext0, #a6adc8); text-align:center; } .empty strong { color:var(--ctp-text, #cdd6f4); font-size:16px; } .empty small { font-size:12px; }
    .skeleton { min-height:56px; flex:none; display:flex; align-items:center; gap:16px; padding:0 16px; border:1px solid color-mix(in srgb, var(--ctp-surface0, #313244) 20%, transparent); border-radius:8px; } .skeleton i,.skeleton b,.skeleton span { display:block; position:relative; overflow:hidden; background:var(--ctp-surface0, #313244); } .skeleton i { width:24px; height:24px; border-radius:50%; } .skeleton span { width:140px; height:14px; border-radius:4px; } .skeleton b { width:18px; height:18px; margin-left:auto; border-radius:50%; }
    .skeleton i::after,.skeleton span::after,.skeleton b::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,var(--ctp-surface1, #45475a),transparent); animation:shimmer 1.5s infinite; } @keyframes shimmer { to { transform:translateX(100%); } }
  `],
})
export class CozyList {
  model = input<unknown>(null); rowContent = input<unknown>(undefined); spacing = input<number>(8); paddingLeft = input<number>(4); paddingRight = input<number>(4); paddingTop = input<number>(4); paddingBottom = input<number>(4); emptyStateIcon = input<string>('package-open'); emptyStateTitle = input<string>('Nenhum item encontrado'); emptyStateSubtitle = input<string>(''); isLoading = input<boolean>(false); sortable = input<boolean>(false); listId = input<string>(''); sortableDragKey = input<string>('mochads-sortable'); itemsReordered = output<{ fromIndex:number; toIndex:number }>(); itemClicked = output<{ modelData:unknown }>(); protected dragIndex = signal(-1); protected readonly skeletons = Array.from({ length:5 });
  protected items = computed<unknown[]>(() => Array.isArray(this.model()) ? this.model() as unknown[] : typeof this.model() === 'number' ? Array.from({ length:this.model() as number }, (_,i)=>i) : []); protected isEmpty = computed(() => this.items().length === 0); protected padding = computed(() => `${this.paddingTop()}px ${this.paddingRight()}px ${this.paddingBottom()}px ${this.paddingLeft()}px`); protected label(item:unknown):string { return typeof item === 'object' && item ? String((item as Record<string,unknown>)['label'] ?? (item as Record<string,unknown>)['title'] ?? '') : String(item); }
  protected drop(toIndex:number):void { const fromIndex=this.dragIndex(); if(this.sortable() && fromIndex>=0 && fromIndex!==toIndex) this.itemsReordered.emit({ fromIndex,toIndex }); this.dragIndex.set(-1); }
}

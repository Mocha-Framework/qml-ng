// Refined manually. Do not overwrite.

import { Component, model, input, signal, computed, output } from '@angular/core';

export interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

@Component({
  selector: 'SelectTree',
  standalone: true,
  template: `
    <div class="qml-select-tree" [class.is-open]="open()" [class.disabled]="disabled()">
      @if (label(); as lbl) { <label class="qml-select-tree-label">{{ lbl }}</label> }
      <button type="button" class="qml-select-tree-trigger" [disabled]="disabled()" (click)="toggle()">
        @if (selectedNode(); as sel) {
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span>{{ sel.label }}</span>
        } @else {
          <span class="qml-select-tree-placeholder">{{ placeholder() }}</span>
        }
        <svg class="qml-select-tree-chevron" [class.up]="open()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      @if (open()) {
        <div class="qml-select-tree-popover" (click)="$event.stopPropagation()">
          <div class="qml-select-tree-list">
            @for (item of flatList(); track item.node.key) {
              <button type="button" class="qml-select-tree-item"
                [class.selected]="item.node.key === value()"
                [style.padding-left.px]="10 + item.level * 16"
                (click)="select(item.node)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  @if (item.node.children && item.node.children.length > 0) {
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  } @else {
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  }
                </svg>
                <span>{{ item.node.label }}</span>
              </button>
            }
            @if (flatList().length === 0) { <div class="qml-select-tree-empty">Sem itens</div> }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-select-tree { position: relative; display: inline-flex; flex-direction: column; gap: 6px; min-width: 220px; }
    .qml-select-tree-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-select-tree-trigger { display: flex; align-items: center; gap: 10px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 10px 14px; color: var(--ctp-text, #cdd6f4); cursor: pointer;
      font-family: inherit; font-size: 0.95rem; min-height: 42px; min-width: 240px;
      transition: border-color 0.18s ease, box-shadow 0.18s ease; }
    .qml-select-tree-trigger:hover:not(:disabled) { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-select-tree.is-open .qml-select-tree-trigger { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-select-tree.disabled { opacity: 0.5; pointer-events: none; }
    .qml-select-tree-placeholder { color: var(--ctp-overlay0, #6e738d); flex: 1; text-align: left; }
    .qml-select-tree-trigger > span { flex: 1; text-align: left; }
    .qml-select-tree-chevron { color: var(--ctp-subtext0, #a6adc8); transition: transform 0.2s ease; }
    .qml-select-tree-chevron.up { transform: rotate(180deg); }
    .qml-select-tree-popover { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 12px; box-shadow: var(--ctp-shadow-lg); overflow: hidden; min-width: 240px;
      animation: qml-tree-pop 0.16s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes qml-tree-pop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .qml-select-tree-list { max-height: 280px; overflow-y: auto; padding: 4px; }
    .qml-select-tree-item { display: flex; align-items: center; gap: 10px; width: 100%;
      padding: 8px 10px; border-radius: 6px; background: none; border: none;
      color: var(--ctp-text, #cdd6f4); font-family: inherit; font-size: 0.9rem;
      cursor: pointer; text-align: left; transition: background-color 0.12s ease; }
    .qml-select-tree-item:hover { background: var(--ctp-surface0, #313244); }
    .qml-select-tree-item.selected { color: var(--ctp-mauve, #cba6f7); background: color-mix(in srgb, var(--ctp-mauve, #cba6f7) 12%, transparent); }
    .qml-select-tree-item > span { flex: 1; }
    .qml-select-tree-empty { padding: 14px; text-align: center; font-size: 0.85rem; color: var(--ctp-overlay0, #6e738d); }
    .qml-select-tree-list::-webkit-scrollbar { width: 6px; }
    .qml-select-tree-list::-webkit-scrollbar-thumb { background: var(--ctp-surface1, #45475a); border-radius: 99px; }
  `],
  host: { '(document:click)': 'onDocClick($event)' },
})
export class SelectTree {
  value = model<string>('');
  nodes = input<TreeNode[]>([]);
  label = input<string>('');
  placeholder = input<string>('Selecione...');
  disabled = input<boolean>(false);

  selected = output<{ node: TreeNode }>();

  protected open = signal(false);

  protected flatList = computed(() => {
    const list: Array<{ node: TreeNode; level: number }> = [];
    const walk = (n: TreeNode[], level: number) => {
      for (const x of n) {
        list.push({ node: x, level });
        if (x.children?.length) walk(x.children, level + 1);
      }
    };
    walk(this.nodes(), 0);
    return list;
  });

  protected selectedNode = computed(() => {
    const find = (n: TreeNode[]): TreeNode | null => {
      for (const x of n) {
        if (x.key === this.value()) return x;
        if (x.children) { const f = find(x.children); if (f) return f; }
      }
      return null;
    };
    return find(this.nodes());
  });

  protected toggle(): void { if (!this.disabled()) this.open.update(v => !v); }
  protected select(node: TreeNode): void {
    this.value.set(node.key);
    this.open.set(false);
    this.selected.emit({ node });
  }

  protected onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('qml-select-tree, SelectTree')) this.open.set(false);
  }
}

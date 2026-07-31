// Refined manually. Do not overwrite.

import { Component, model, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'AdvancedSelect',
  standalone: true,
  template: `
    <div class="qml-adv-select" [class.is-open]="open()" [class.disabled]="disabled()">
      @if (label(); as lbl) { <label class="qml-adv-select-label">{{ lbl }}</label> }
      <button type="button" class="qml-adv-select-trigger" [disabled]="disabled()" (click)="toggle()">
        <div class="qml-adv-select-badges">
          @if (selectedOptions().length === 0) {
            <span class="qml-adv-select-placeholder">{{ placeholder() }}</span>
          } @else if (multiple()) {
            @for (opt of selectedOptions().slice(0, 3); track opt.value) {
              <span class="qml-adv-select-badge">{{ opt.label }}
                <button type="button" class="qml-adv-select-badge-x" (click)="remove(opt.value, $event)" aria-label="Remove">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            }
            @if (selectedOptions().length > 3) { <span class="qml-adv-select-more">+{{ selectedOptions().length - 3 }}</span> }
          } @else {
            <span class="qml-adv-select-value">{{ selectedOptions()[0].label }}</span>
          }
        </div>
        <svg class="qml-adv-select-chevron" [class.up]="open()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      @if (open()) {
        <div class="qml-adv-select-popover" (click)="$event.stopPropagation()">
          <div class="qml-adv-select-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" [value]="search()" (input)="onSearch($event)" placeholder="Buscar..." />
          </div>
          <div class="qml-adv-select-list">
            @for (opt of filteredOptions(); track opt.value; let i = $index) {
              <button type="button" class="qml-adv-select-item" [class.selected]="isSelected(opt.value)"
                [class.highlighted]="i === highlightIndex()" (click)="select(opt.value)" (mouseenter)="highlightIndex.set(i)">
                @if (multiple()) { <span class="qml-adv-select-check">{{ isSelected(opt.value) ? '✓' : '' }}</span> }
                <span class="qml-adv-select-item-label">{{ opt.label }}</span>
                @if (!multiple() && isSelected(opt.value)) { <svg class="qml-adv-select-item-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> }
              </button>
            }
            @if (filteredOptions().length === 0) { <div class="qml-adv-select-empty">Nenhum resultado</div> }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-adv-select { position: relative; display: inline-flex; flex-direction: column; gap: 6px; min-width: 260px; }
    .qml-adv-select-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-adv-select-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 8px 12px; color: var(--ctp-text, #cdd6f4); cursor: pointer;
      font-family: inherit; font-size: 0.9rem; min-height: 42px; min-width: 320px;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }
    .qml-adv-select-trigger:hover:not(:disabled) { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-adv-select.is-open .qml-adv-select-trigger { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-adv-select.disabled { opacity: 0.5; pointer-events: none; }
    .qml-adv-select-badges { flex: 1; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; min-height: 26px; }
    .qml-adv-select-placeholder { color: var(--ctp-overlay0, #6e738d); }
    .qml-adv-select-value { color: var(--ctp-text, #cdd6f4); }
    .qml-adv-select-badge { display: inline-flex; align-items: center; gap: 4px;
      background: color-mix(in srgb, var(--ctp-mauve, #cba6f7) 18%, transparent); color: var(--ctp-mauve, #cba6f7);
      padding: 2px 4px 2px 8px; border-radius: 9999px; font-size: 0.78rem; font-weight: 600; }
    .qml-adv-select-badge-x { display: inline-flex; align-items: center; justify-content: center; background: none; border: none;
      cursor: pointer; color: inherit; padding: 2px; border-radius: 50%; line-height: 0; }
    .qml-adv-select-badge-x:hover { background: color-mix(in srgb, var(--ctp-mauve) 25%, transparent); }
    .qml-adv-select-more { font-size: 0.78rem; font-weight: 600; color: var(--ctp-overlay0, #6e738d); padding: 2px 8px; }
    .qml-adv-select-chevron { color: var(--ctp-subtext0, #a6adc8); transition: transform 0.2s ease; }
    .qml-adv-select-chevron.up { transform: rotate(180deg); }
    .qml-adv-select-popover { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 12px; box-shadow: var(--ctp-shadow-lg); overflow: hidden; min-width: 280px;
      animation: qml-adv-pop 0.16s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes qml-adv-pop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .qml-adv-select-search { display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      border-bottom: 1px solid var(--ctp-surface1, #45475a); color: var(--ctp-subtext0, #a6adc8); }
    .qml-adv-select-search input { flex: 1; border: none; background: transparent; outline: none;
      font-family: inherit; font-size: 0.85rem; color: var(--ctp-text, #cdd6f4); padding: 4px 0; }
    .qml-adv-select-list { max-height: 280px; overflow-y: auto; padding: 4px; }
    .qml-adv-select-item { display: flex; align-items: center; gap: 10px; width: 100%;
      padding: 9px 12px; border-radius: 8px; background: none; border: none;
      color: var(--ctp-text, #cdd6f4); font-family: inherit; font-size: 0.92rem;
      cursor: pointer; text-align: left; transition: background-color 0.12s ease; }
    .qml-adv-select-item.highlighted, .qml-adv-select-item:hover { background: var(--ctp-surface0, #313244); }
    .qml-adv-select-item.selected { color: var(--ctp-mauve, #cba6f7); }
    .qml-adv-select-check { width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; color: var(--ctp-mauve); }
    .qml-adv-select-item-label { flex: 1; }
    .qml-adv-select-item-check { color: var(--ctp-mauve); }
    .qml-adv-select-empty { padding: 14px; text-align: center; font-size: 0.85rem; color: var(--ctp-overlay0, #6e738d); }
    .qml-adv-select-list::-webkit-scrollbar { width: 6px; }
    .qml-adv-select-list::-webkit-scrollbar-thumb { background: var(--ctp-surface1, #45475a); border-radius: 99px; }
  `],
  host: { '(document:click)': 'onDocClick($event)' },
})
export class AdvancedSelect {
  value = model<any | any[]>(null);
  options = input<Array<{ value: any; label: string }>>([]);
  multiple = input<boolean>(false);
  label = input<string>('');
  placeholder = input<string>('Selecione...');
  disabled = input<boolean>(false);

  selected = output<any>();

  protected open = signal(false);
  protected search = signal('');
  protected highlightIndex = signal(0);

  protected filteredOptions = computed(() => {
    const s = this.search().toLowerCase();
    return s ? this.options().filter(o => o.label.toLowerCase().includes(s)) : this.options();
  });

  protected selectedOptions = computed(() => {
    const v = this.value();
    if (v == null) return [];
    const arr = Array.isArray(v) ? v : [v];
    return this.options().filter(o => arr.includes(o.value));
  });

  protected isSelected(v: any): boolean {
    const cur = this.value();
    return Array.isArray(cur) ? cur.includes(v) : cur === v;
  }

  protected toggle(): void { if (!this.disabled()) this.open.update(v => !v); }

  protected select(v: any): void {
    if (this.multiple()) {
      const cur = Array.isArray(this.value()) ? [...this.value()] : [];
      const idx = cur.indexOf(v);
      if (idx >= 0) cur.splice(idx, 1); else cur.push(v);
      this.value.set(cur);
    } else {
      this.value.set(v);
      this.open.set(false);
    }
    this.selected.emit(this.value());
  }

  protected remove(v: any, event: MouseEvent): void {
    event.stopPropagation();
    if (this.multiple()) {
      const cur = (this.value() as any[]).filter(x => x !== v);
      this.value.set(cur);
      this.selected.emit(cur);
    } else { this.value.set(null); this.selected.emit(null); }
  }

  protected onSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.highlightIndex.set(0); }
  protected onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('qml-adv-select, AdvancedSelect')) this.open.set(false);
  }
}

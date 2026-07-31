// Refined manually. Do not overwrite.

import { Component, model, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'Select',
  standalone: true,
  template: `
    <div class="qml-select" [class.disabled]="disabled()" [class.is-open]="open()" [class.has-error]="!!errorText()" [style.width]="width()">
      @if (label(); as lbl) {
        <label class="qml-select-label">{{ lbl }}@if (required()) { <span class="qml-select-required">*</span> }</label>
      }
      <button type="button" class="qml-select-trigger" [disabled]="disabled()" (click)="toggle()" (keydown)="onKey($event)">
        <span class="qml-select-value" [class.placeholder]="!selectedLabel()">{{ selectedLabel() || placeholder() }}</span>
        <svg class="qml-select-chevron" [class.up]="open()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      @if (open()) {
        <div class="qml-select-popover" role="listbox">
          @if (searchable()) {
            <div class="qml-select-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" [value]="search()" (input)="onSearch($event)" placeholder="Buscar..." />
            </div>
          }
          <div class="qml-select-list">
            @for (opt of filteredOptions(); track opt.value; let i = $index) {
              <button type="button" class="qml-select-item" [class.selected]="opt.value === value()" [class.highlighted]="i === highlightIndex()" (click)="select(opt.value)" (mouseenter)="highlightIndex.set(i)">
                @if (opt.icon; as ic) { <span class="qml-select-item-icon">{{ ic }}</span> }
                <span class="qml-select-item-label">{{ opt.label }}</span>
                @if (opt.value === value()) { <svg class="qml-select-item-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> }
              </button>
            }
            @if (filteredOptions().length === 0) { <div class="qml-select-empty">Nenhum item</div> }
          </div>
        </div>
      }
      @if (errorText(); as err) { <p class="qml-select-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-select { position: relative; display: inline-flex; flex-direction: column; gap: 6px; min-width: 200px; }
    .qml-select-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); display: flex; gap: 4px; }
    .qml-select-required { color: var(--ctp-red, #f38ba8); }
    .qml-select-trigger { display: flex; align-items: center; justify-content: space-between; gap: 10px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 10px 14px; font-family: inherit; cursor: pointer; color: var(--ctp-text, #cdd6f4);
      font-size: 0.95rem; transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      text-align: left; width: 100%; min-height: 42px; }
    .qml-select-trigger:hover:not(:disabled) { border-color: var(--ctp-overlay1, #7f849c); background: var(--ctp-surface1, #45475a); }
    .qml-select.is-open .qml-select-trigger { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-select.has-error .qml-select-trigger { border-color: var(--ctp-red, #f38ba8); }
    .qml-select.disabled { opacity: 0.55; pointer-events: none; }
    .qml-select-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .qml-select-value.placeholder { color: var(--ctp-overlay0, #6e738d); }
    .qml-select-chevron { color: var(--ctp-subtext0, #a6adc8); transition: transform 0.2s ease; }
    .qml-select-chevron.up { transform: rotate(180deg); }
    .qml-select-popover { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 12px; box-shadow: var(--ctp-shadow-lg); overflow: hidden; min-width: 220px;
      animation: qml-select-pop 0.16s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes qml-select-pop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .qml-select-search { display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      border-bottom: 1px solid var(--ctp-surface1, #45475a); color: var(--ctp-subtext0, #a6adc8); }
    .qml-select-search input { flex: 1; border: none; background: transparent; outline: none;
      font-family: inherit; font-size: 0.85rem; color: var(--ctp-text, #cdd6f4); padding: 4px 0; }
    .qml-select-list { max-height: 260px; overflow-y: auto; padding: 4px; }
    .qml-select-item { display: flex; align-items: center; gap: 10px; width: 100%;
      padding: 9px 12px; border-radius: 8px; background: none; border: none;
      color: var(--ctp-text, #cdd6f4); font-family: inherit; font-size: 0.92rem;
      cursor: pointer; text-align: left; transition: background-color 0.12s ease; }
    .qml-select-item.highlighted, .qml-select-item:hover { background: var(--ctp-surface0, #313244); }
    .qml-select-item.selected { color: var(--ctp-mauve, #cba6f7); }
    .qml-select-item-label { flex: 1; }
    .qml-select-item-check { color: var(--ctp-mauve, #cba6f7); }
    .qml-select-empty { padding: 14px; text-align: center; font-size: 0.85rem; color: var(--ctp-overlay0, #6e738d); }
    .qml-select-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8); }
    /* scrollbar */
    .qml-select-list::-webkit-scrollbar { width: 6px; }
    .qml-select-list::-webkit-scrollbar-thumb { background: var(--ctp-surface1, #45475a); border-radius: 99px; }
  `],
})
export class Select {
  value = model<any>(null);
  options = input<Array<{ value: any; label: string; icon?: string }>>([]);
  label = input<string>('');
  placeholder = input<string>('Selecione...');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  errorText = input<string>('');
  searchable = input<boolean>(false);
  width = input<string>('100%');

  selectedIndex = output<number>();
  selectedValue = output<any>();

  protected open = signal(false);
  protected search = signal('');
  protected highlightIndex = signal(0);

  protected filteredOptions = computed(() => {
    const s = this.search().toLowerCase();
    return s ? this.options().filter(o => o.label.toLowerCase().includes(s)) : this.options();
  });

  protected selectedLabel = computed(() => {
    const v = this.value();
    const found = this.options().find(o => o.value === v);
    return found?.label ?? '';
  });

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update(v => !v);
    if (this.open()) this.highlightIndex.set(Math.max(0, this.options().findIndex(o => o.value === this.value())));
  }

  protected select(v: any): void {
    this.value.set(v);
    this.open.set(false);
    this.search.set('');
    const idx = this.options().findIndex(o => o.value === v);
    if (idx >= 0) { this.selectedIndex.emit(idx); this.selectedValue.emit(v); }
  }

  protected onSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.highlightIndex.set(0); }

  protected onKey(event: KeyboardEvent): void {
    if (!this.open() && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); this.toggle(); return; }
    if (!this.open()) return;
    const list = this.filteredOptions();
    if (event.key === 'ArrowDown') { event.preventDefault(); this.highlightIndex.update(i => Math.min(list.length - 1, i + 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); this.highlightIndex.update(i => Math.max(0, i - 1)); }
    else if (event.key === 'Enter') { event.preventDefault(); const opt = list[this.highlightIndex()]; if (opt) this.select(opt.value); }
    else if (event.key === 'Escape') { this.open.set(false); }
  }
}

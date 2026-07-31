// Refined manually. Do not overwrite.

import { Component, model, input, signal, computed } from '@angular/core';

@Component({
  selector: 'DatePicker',
  standalone: true,
  template: `
    <div class="qml-date-picker" [class.is-open]="open()" [class.disabled]="disabled()" [class.has-error]="!!errorText()">
      @if (label(); as lbl) { <label class="qml-date-picker-label">{{ lbl }}</label> }
      <button type="button" class="qml-date-picker-trigger" [disabled]="disabled()" (click)="toggle()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span [class.placeholder]="!value()">{{ value() ? formatDate(value()) : placeholder() }}</span>
      </button>
      @if (open()) {
        <div class="qml-date-picker-popover" (click)="$event.stopPropagation()">
          <div class="qml-date-picker-header">
            <button type="button" class="qml-date-picker-nav" (click)="prevMonth()" aria-label="Mês anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <span class="qml-date-picker-title">{{ monthLabel() }}</span>
            <button type="button" class="qml-date-picker-nav" (click)="nextMonth()" aria-label="Próximo mês">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <div class="qml-date-picker-weekdays">
            @for (w of weekdays; track w) { <span class="qml-date-picker-weekday">{{ w }}</span> }
          </div>
          <div class="qml-date-picker-grid">
            @for (cell of calendarGrid(); track $index) {
              <button type="button" class="qml-date-picker-day"
                [class.other-month]="!cell.inMonth"
                [class.today]="cell.today"
                [class.selected]="cell.selected"
                [disabled]="!cell.inMonth"
                (click)="select(cell.date)">{{ cell.day }}</button>
            }
          </div>
          <div class="qml-date-picker-footer">
            <button type="button" class="qml-date-picker-today" (click)="setToday()">Hoje</button>
            <button type="button" class="qml-date-picker-clear" (click)="clear()">Limpar</button>
          </div>
        </div>
      }
      @if (errorText(); as err) { <p class="qml-date-picker-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); }
    .qml-date-picker { position: relative; display: inline-flex; flex-direction: column; gap: 6px; }
    .qml-date-picker-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-date-picker-trigger { display: inline-flex; align-items: center; gap: 10px;
      background: var(--ctp-surface0, #313244); border: 1.5px solid var(--ctp-surface2, #585b70);
      border-radius: 12px; padding: 10px 14px; color: var(--ctp-text, #cdd6f4); cursor: pointer;
      font-family: inherit; font-size: 0.95rem; min-width: 220px; min-height: 42px;
      transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease; }
    .qml-date-picker-trigger:hover:not(:disabled) { border-color: var(--ctp-overlay1, #7f849c); background: var(--ctp-surface1, #45475a); }
    .qml-date-picker.is-open .qml-date-picker-trigger { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 20%, transparent); }
    .qml-date-picker.has-error .qml-date-picker-trigger { border-color: var(--ctp-red, #f38ba8); }
    .qml-date-picker.disabled { opacity: 0.5; pointer-events: none; }
    .qml-date-picker-trigger .placeholder { color: var(--ctp-overlay0, #6e738d); }
    .qml-date-picker-popover { position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
      background: var(--ctp-mantle, #181825); border: 1.5px solid var(--ctp-surface1, #45475a);
      border-radius: 14px; padding: 14px; box-shadow: var(--ctp-shadow-lg); width: 300px;
      animation: qml-dp-pop 0.16s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes qml-dp-pop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .qml-date-picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .qml-date-picker-title { font-weight: 700; font-size: 0.95rem; color: var(--ctp-text, #cdd6f4); text-transform: capitalize; }
    .qml-date-picker-nav { display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 8px; background: none; border: none;
      color: var(--ctp-subtext0, #a6adc8); cursor: pointer; transition: background-color 0.12s ease, color 0.12s ease; }
    .qml-date-picker-nav:hover { background: var(--ctp-surface0, #313244); color: var(--ctp-mauve, #cba6f7); }
    .qml-date-picker-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 4px; }
    .qml-date-picker-weekday { font-size: 0.72rem; font-weight: 700; color: var(--ctp-overlay0, #6e738d); text-align: center; padding: 4px 0; text-transform: uppercase; }
    .qml-date-picker-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .qml-date-picker-day { background: none; border: none; font-family: inherit; font-size: 0.85rem; padding: 8px 0;
      border-radius: 8px; color: var(--ctp-text, #cdd6f4); cursor: pointer; transition: background-color 0.12s ease, color 0.12s ease; }
    .qml-date-picker-day:hover:not(:disabled):not(.selected) { background: var(--ctp-surface0, #313244); }
    .qml-date-picker-day.other-month { color: var(--ctp-overlay0, #6e738d); }
    .qml-date-picker-day.today { box-shadow: inset 0 0 0 1px var(--ctp-mauve, #cba6f7); }
    .qml-date-picker-day.selected { background: var(--ctp-mauve, #cba6f7); color: var(--ctp-base, #1e1e2e); font-weight: 700; }
    .qml-date-picker-footer { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--ctp-surface1, #45475a); }
    .qml-date-picker-today, .qml-date-picker-clear { background: none; border: none; color: var(--ctp-mauve, #cba6f7); font-family: inherit; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
    .qml-date-picker-today:hover, .qml-date-picker-clear:hover { background: color-mix(in srgb, var(--ctp-mauve, #cba6f7) 12%, transparent); }
    .qml-date-picker-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8); }
  `],
  host: { '(document:click)': 'onDocClick($event)' },
})
export class DatePicker {
  value = model<Date | null>(null);
  label = input<string>('');
  placeholder = input<string>('Selecione uma data');
  disabled = input<boolean>(false);
  errorText = input<string>('');

  protected open = signal(false);
  protected viewMonth = signal(new Date().getMonth());
  protected viewYear = signal(new Date().getFullYear());
  protected weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  protected calendarGrid = computed(() => {
    const month = this.viewMonth();
    const year = this.viewYear();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const today = new Date();
    const sel = this.value();
    const cells: Array<{ day: number; date: Date; inMonth: boolean; today: boolean; selected: boolean }> = [];
    for (let i = startDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, date: new Date(year, month - 1, daysInPrev - i), inMonth: false, today: false, selected: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ day: d, date, inMonth: true, today: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(), selected: !!sel && date.toDateString() === sel.toDateString() });
    }
    while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - startDay + 1, date: new Date(year, month + 1, cells.length - daysInMonth - startDay + 1), inMonth: false, today: false, selected: false });
    return cells;
  });

  protected monthLabel = computed(() => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${months[this.viewMonth()]} ${this.viewYear()}`;
  });

  protected toggle(): void { if (!this.disabled()) this.open.update(v => !v); }
  protected prevMonth(): void { const m = this.viewMonth(); if (m === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); } else this.viewMonth.set(m - 1); }
  protected nextMonth(): void { const m = this.viewMonth(); if (m === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); } else this.viewMonth.set(m + 1); }
  protected select(date: Date): void { this.value.set(date); this.open.set(false); }
  protected setToday(): void { const t = new Date(); this.value.set(t); this.viewMonth.set(t.getMonth()); this.viewYear.set(t.getFullYear()); this.open.set(false); }
  protected clear(): void { this.value.set(null); }
  protected formatDate(d: Date): string { return d.toLocaleDateString('pt-BR'); }
  protected onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('qml-date-picker, DatePicker')) this.open.set(false);
  }
}

// Refined manually. Do not overwrite.

import { Component, computed, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'Paginator', standalone: true,
  template: `
    <div class="qml-paginator" [class.disabled]="disabled()">
      <button class="qml-page outline" [disabled]="disabled() || currentPage() <= 1" (click)="move(-1)" aria-label="Página anterior"><qml-icon name="chevron-left" size="16" /></button>
      <div class="qml-pages" [class.animate]="animating()">
        @for (page of pages(); track $index) {
          @if (page === '...') { <span class="ellipsis">...</span> }
          @else { <button class="qml-page" [class.active]="page === currentPage()" [disabled]="disabled()" (click)="go(page)">{{ page }}</button> }
        }
      </div>
      @if (showGoToPage()) { <input #jump class="qml-jump" [class.error]="invalid()" type="number" placeholder="Ir" [disabled]="disabled()" (input)="jumpValue.set(jump.value)" (keydown.enter)="confirm()" /> }
      <button class="qml-page outline" [class.confirm]="confirmState()" [disabled]="disabled() || (!confirmState() && currentPage() >= totalPages())" (click)="confirmState() ? confirm() : move(1)" aria-label="Próxima página">
        <qml-icon [name]="confirmState() ? 'check' : 'chevron-right'" size="16" />
      </button>
    </div>
  `,
  styles: [`
    .qml-paginator { display:inline-flex; align-items:center; gap:8px; font-family:var(--ctp-font-family, sans-serif); user-select:none; }
    .qml-paginator.disabled { opacity:.6; } .qml-pages { display:flex; align-items:center; gap:4px; }
    .qml-pages.animate { animation:qml-page-change 220ms cubic-bezier(.22,1,.36,1); }
    .qml-page { min-width:32px; height:32px; padding:0 8px; display:inline-flex; align-items:center; justify-content:center; border:0; border-radius:8px; background:transparent; color:var(--ctp-text, #cdd6f4); cursor:pointer; font:500 12px inherit; transition:transform 150ms, background 150ms, color 150ms; }
    .qml-page:hover:not(:disabled) { background:color-mix(in srgb, var(--ctp-surface0, #313244) 50%, transparent); transform:scale(1.02); }
    .qml-page.active { color:var(--ctp-base, #1e1e2e); background:var(--ctp-primary, #cba6f7); font-weight:700; transform:scale(1.04); }
    .qml-page.outline { border:1px solid var(--ctp-surface1, #45475a); background:transparent; }
    .qml-page.confirm { color:var(--ctp-base, #1e1e2e); background:var(--ctp-primary, #cba6f7); border-color:var(--ctp-primary, #cba6f7); }
    .qml-page:disabled { opacity:.45; cursor:not-allowed; } .ellipsis { width:18px; text-align:center; color:var(--ctp-overlay1, #7f849c); }
    .qml-jump { width:48px; height:32px; box-sizing:border-box; border:1px solid var(--ctp-surface1, #45475a); border-radius:8px; background:var(--ctp-surface0, #313244); color:var(--ctp-text, #cdd6f4); text-align:center; outline:none; transition:width 140ms, border-color 140ms; }
    .qml-jump:focus { width:64px; border-color:var(--ctp-primary, #cba6f7); } .qml-jump.error { border-color:var(--ctp-red, #f38ba8); }
    @keyframes qml-page-change { from { opacity:.8; transform:translateX(10px) scale(.975); } to { opacity:1; transform:none; } }
  `],
})
export class Paginator {
  currentPage = model<number>(1); totalPages = input<number>(1); showGoToPage = input<boolean>(false); disabled = input<boolean>(false);
  pageChanged = output<{ page: number }>(); protected jumpValue = signal(''); protected invalid = signal(false); protected animating = signal(false);
  protected confirmState = computed(() => !this.disabled() && this.showGoToPage() && this.jumpValue() !== '');
  protected pages = computed<Array<number | '...'>>(() => {
    const current = this.currentPage(), total = Math.max(0, this.totalPages()); if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const result: Array<number | '...'> = [1], start = Math.max(2, current - 1), end = Math.min(total - 1, current + 1);
    if (start > 2) result.push('...'); for (let page = start; page <= end; page++) result.push(page); if (end < total - 1) result.push('...'); result.push(total); return result;
  });
  protected move(delta: number): void { this.go(this.currentPage() + delta); }
  protected go(page: number): void { if (page < 1 || page > this.totalPages() || page === this.currentPage()) return; this.currentPage.set(page); this.pageChanged.emit({ page }); this.animating.set(false); requestAnimationFrame(() => this.animating.set(true)); }
  protected confirm(): void { const page = Number(this.jumpValue()); if (Number.isInteger(page) && page >= 1 && page <= this.totalPages()) { this.go(page); this.jumpValue.set(''); this.invalid.set(false); } else this.invalid.set(true); }
}

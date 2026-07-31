// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'EmptyState',
  standalone: true,
  template: `
    <div class="qml-empty-state" [style.padding]="padding()">
      @if (icon(); as i) {
        <div class="qml-empty-state-icon" [style.color]="iconColor() || null">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" [attr.data-icon]="i">
            @switch (i) {
              @case ('inbox') { <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path> }
              @case ('search') { <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line> }
              @case ('box')   { <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line> }
              @case ('file')  { <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline> }
              @default { <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line> }
            }
          </svg>
        </div>
      }
      @if (title(); as t) { <h2 class="qml-empty-state-title">{{ t }}</h2> }
      @if (description(); as d) { <p class="qml-empty-state-desc">{{ d }}</p> }
      <div class="qml-empty-state-action"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; gap: 8px; padding: 32px 16px; color: var(--ctp-subtext0, #a6adc8); }
    .qml-empty-state-icon { color: var(--ctp-overlay0, #6e738d); display: inline-flex;
      width: 80px; height: 80px; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--ctp-mauve, #cba6f7) 8%, transparent); border-radius: 50%;
      margin-bottom: 4px; }
    .qml-empty-state-title { margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--ctp-text, #cdd6f4); }
    .qml-empty-state-desc { margin: 0; font-size: 0.88rem; max-width: 380px; line-height: 1.45; color: var(--ctp-subtext1, #bac2de); }
    .qml-empty-state-action { margin-top: 12px; }
  `],
})
export class EmptyState {
  icon = input<string>('inbox');
  title = input<string>('');
  description = input<string>('');
  iconColor = input<string>('');
  padding = input<string>('32px 16px');
}

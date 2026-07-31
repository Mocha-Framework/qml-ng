// Refined manually. Do not overwrite.

import { Component, computed, inject, input, model, output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Accordion',
  standalone: true,
  template: `
    <div class="qml-accordion" [class]="rootClass()" [attr.data-variant]="variant()" [attr.data-state]="open() ? 'open' : 'closed'"
      [style.--qml-accordion-bg]="finalBackground()" [style.--qml-accordion-border-color]="finalBorderColor()"
      [style.--qml-accordion-radius.px]="finalRadius()" [style.--qml-accordion-accent]="accentColorResolved()"
      [style.--qml-accordion-text]="finalTextColor()" (click)="toggle()" (keydown.enter)="toggle()"
      (keydown.space)="$event.preventDefault(); toggle()" tabindex="0">
      <div class="qml-accordion-header" [class.no-radius-bottom]="open()">
        @if (icon()) {
          <span class="qml-accordion-icon" [innerHTML]="iconSvg(icon(), 20)"></span>
        }
        <span class="qml-accordion-title">{{ title() }}</span>
        <span class="qml-accordion-chevron" [innerHTML]="iconSvg('chevron-down', 18)" [class.rotated]="open()"></span>
      </div>
      <div class="qml-accordion-collapse" [class.open]="open()">
        <div class="qml-accordion-content">
          <div class="qml-accordion-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .qml-accordion {
      position: relative;
      background: var(--qml-accordion-bg, var(--ctp-base, #1e1e2e));
      color: var(--qml-accordion-text, var(--ctp-text, #cdd6f4));
      border-radius: var(--qml-accordion-radius, 12px);
      border: 1px solid transparent;
      box-sizing: border-box;
      font-family: var(--ctp-font-family, sans-serif);
      overflow: hidden;
      transition: border-color 150ms ease;
    }
    .qml-accordion-variant-default { background: var(--ctp-base, #1e1e2e); }
    .qml-accordion-variant-outline { background: transparent; border-color: var(--qml-accordion-border-color, var(--ctp-surface1)); }
    .qml-accordion-variant-tonal { background: var(--ctp-surface0, #313244); }
    .qml-accordion-variant-split { background: var(--ctp-base, #1e1e2e); }
    .qml-accordion-variant-filled { border-color: transparent; }
    .qml-accordion-header {
      display: flex; align-items: center; gap: 12px;
      height: 48px; padding: 0 16px; cursor: pointer;
      position: relative; user-select: none;
      transition: background-color 120ms;
      outline: none;
    }
    .qml-accordion-header:focus-visible { box-shadow: inset 0 0 0 2px var(--qml-accordion-accent, var(--ctp-mauve)); }
    .qml-accordion-variant-default .qml-accordion-header { background: var(--ctp-surface0, #313244); }
    .qml-accordion-header:hover { background: color-mix(in srgb, var(--qml-accordion-accent, var(--ctp-mauve)) 8%, var(--ctp-surface0)); }
    .qml-accordion-icon { display: inline-flex; color: var(--qml-accordion-accent, var(--ctp-mauve)); flex-shrink: 0; }
    .qml-accordion-title { flex: 1; font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qml-accordion-chevron { display: inline-flex; color: var(--ctp-overlay1, #7f849c); transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms; flex-shrink: 0; }
    .qml-accordion-chevron.rotated { transform: rotate(180deg); color: var(--qml-accordion-accent, var(--ctp-mauve)); }
    .qml-accordion-collapse {
      display: grid; grid-template-rows: 0fr;
      transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .qml-accordion-collapse.open { grid-template-rows: 1fr; }
    .qml-accordion-content { overflow: hidden; }
    .qml-accordion-body { padding: 16px; font-size: 14px; line-height: 1.5; color: var(--ctp-subtext1, #bac2de); }
    .qml-accordion-variant-default .qml-accordion-collapse.open .qml-accordion-content { border-top: 1px solid var(--ctp-surface1, #45475a); }
    .qml-accordion-variant-split .qml-accordion { border: 1px solid var(--ctp-surface1, #45475a); }
  `],
})
export class Accordion {
  title = input<string>(''); icon = input<string>('');
  expanded = model<boolean>(false);
  variant = input<'default' | 'outline' | 'tonal' | 'split' | 'filled'>('default');
  interactive = input<boolean>(true);
  accentColor = input<string>('mauve');
  backgroundColor = input<string>('');
  customRadius = input<number>(-1);
  customColor = input<string>('transparent');
  customAccentColor = input<string>('transparent');
  customTextColor = input<string>('transparent');
  toggled = output<boolean>();

  private readonly sanitizer = inject(DomSanitizer);

  protected open = computed(() => this.expanded());
  protected finalRadius = computed(() => this.customRadius() >= 0 ? this.customRadius() : 12);

  protected rootClass = computed(() => `qml-accordion qml-accordion-variant-${this.variant()}`);

  protected accentColorResolved = computed(() => {
    if (this.customAccentColor() !== 'transparent') return this.customAccentColor();
    if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-mauve))`;
    return `var(--ctp-${this.accentColor()}, var(--ctp-mauve))`;
  });

  protected finalBackground = computed(() => {
    if (this.variant() === 'filled') {
      if (this.customColor() !== 'transparent') return this.customColor();
      if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-mauve))`;
      return `var(--ctp-${this.accentColor()}, var(--ctp-mauve))`;
    }
    if (this.variant() === 'tonal') return 'var(--ctp-surface0, #313244)';
    if (this.variant() === 'outline') return 'transparent';
    return '';
  });

  protected finalBorderColor = computed(() => {
    if (this.variant() === 'outline') {
      return this.customAccentColor() !== 'transparent' ? this.customAccentColor() : 'var(--ctp-surface1, #45475a)';
    }
    return 'transparent';
  });

  protected finalTextColor = computed(() => {
    if (this.customTextColor() !== 'transparent') return this.customTextColor();
    if (this.variant() === 'filled') return 'var(--ctp-crust, #11111b)';
    return '';
  });

  protected toggle(): void {
    if (!this.interactive()) return;
    this.expanded.set(!this.expanded());
    this.toggled.emit(this.expanded());
  }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      'chevron-down': '<path d="m6 9 6 6 6-6"/>',
      bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
// Refined manually. Do not overwrite.

import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Tile',
  standalone: true,
  template: `
    <div class="qml-tile" [class]="rootClass()" [class.qml-tile-active]="active()"
      [style.--qml-tile-radius.px]="finalRadius()"
      [style.--qml-tile-bg]="finalBackground()"
      [style.--qml-tile-border-color]="finalBorderColor()"
      [style.--qml-tile-accent]="accentColorResolved()"
      [style.--qml-tile-text]="finalTextColor()"
      (click)="handleClick()">
      @if (showAccent()) {
        <div class="qml-tile-accent"></div>
      }
      <div class="qml-tile-row">
        @if (icon()) {
          <span class="qml-tile-icon" [innerHTML]="iconSvg(icon(), 24)"></span>
        }
        <div class="qml-tile-text">
          @if (title()) { <div class="qml-tile-title">{{ title() }}</div> }
          @if (description()) { <div class="qml-tile-description">{{ description() }}</div> }
          <ng-content></ng-content>
        </div>
        @if (rightIcon() || (interactive() && !rightIconSet())) {
          <span class="qml-tile-right" [innerHTML]="iconSvg(rightIcon() || 'chevron-right', 20)"></span>
        }
        <ng-content select="[right]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .qml-tile {
      position: relative; display: flex; align-items: center;
      width: 320px; min-height: 56px;
      border-radius: var(--qml-tile-radius, 8px);
      background: var(--qml-tile-bg, var(--ctp-base, #1e1e2e));
      border: 1px solid var(--qml-tile-border-color, transparent);
      color: var(--qml-tile-text, var(--ctp-text, #cdd6f4));
      box-sizing: border-box; overflow: hidden;
      font-family: var(--ctp-font-family, sans-serif);
      transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1),
                  background-color 150ms, opacity 150ms;
    }
    .qml-tile-variant-default { background: var(--ctp-base, #1e1e2e); }
    .qml-tile-variant-tonal { background: var(--ctp-surface0, #313244); }
    .qml-tile-variant-outline { background: transparent; border: 1px solid var(--qml-tile-border-color, var(--ctp-surface1)); }
    .qml-tile-variant-filled { border: none; box-shadow: var(--ctp-shadow-sm); }
    .qml-tile-interactive { cursor: pointer; }
    .qml-tile-interactive:hover { transform: scale(1.01); }
    .qml-tile-interactive:active { transform: scale(0.98); }
    .qml-tile-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--qml-tile-accent, var(--ctp-mauve)); }
    .qml-tile-row {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 12px; width: 100%;
    }
    .qml-tile-accent + .qml-tile-row { padding-left: 16px; }
    .qml-tile-icon { display: inline-flex; color: var(--qml-tile-accent, var(--ctp-mauve)); flex-shrink: 0; }
    .qml-tile-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .qml-tile-title { font-weight: 600; font-size: 14px; line-height: 1.3; color: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qml-tile-description { font-size: 12px; color: var(--ctp-subtext0, #a6adc8); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qml-tile-right { display: inline-flex; color: var(--ctp-overlay1, #7f849c); flex-shrink: 0; }
    .qml-tile-active { background: color-mix(in srgb, var(--qml-tile-accent, var(--ctp-mauve)) 10%, var(--ctp-surface0)); }
  `],
})
export class Tile {
  title = input<string>(''); description = input<string>(''); icon = input<string>('');
  rightIcon = input<string>('');
  variant = input<'default' | 'accent' | 'tonal' | 'outline' | 'filled'>('default');
  active = input<boolean>(false);
  interactive = input<boolean>(true);
  draggable = input<boolean>(false);
  dragKey = input<string>('mochads-tile');
  backgroundColor = input<string>('');
  customRadius = input<number>(-1);
  customColor = input<string>('transparent');
  customAccentColor = input<string>('transparent');
  customTextColor = input<string>('transparent');
  hasRightSlot = input<boolean>(false);
  clicked = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  protected finalRadius = computed(() => this.customRadius() >= 0 ? this.customRadius() : 8);
  protected showAccent = computed(() => this.variant() === 'accent' || this.active());
  protected rightIconSet = computed(() => !!this.rightIcon() || this.hasRightSlot());

  protected rootClass = computed(() => {
    const cls = ['qml-tile', `qml-tile-variant-${this.variant()}`];
    if (this.interactive() || this.draggable()) cls.push('qml-tile-interactive');
    return cls.join(' ');
  });

  protected accentColorResolved = computed(() => {
    if (this.customAccentColor() !== 'transparent') return this.customAccentColor();
    if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-mauve))`;
    return 'var(--ctp-mauve)';
  });

  protected finalBackground = computed(() => {
    if (this.variant() === 'filled') {
      if (this.customColor() !== 'transparent') return this.customColor();
      if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-mauve))`;
      return 'var(--ctp-mauve)';
    }
    if (this.variant() === 'tonal') {
      if (this.customColor() !== 'transparent') return `color-mix(in srgb, ${this.customColor()} 15%, transparent)`;
      return 'color-mix(in srgb, var(--ctp-mauve) 15%, var(--ctp-surface0))';
    }
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

  protected handleClick(): void {
    if (this.interactive() || this.draggable()) this.clicked.emit();
  }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      'chevron-right': '<path d="m9 18 6-6-6-6"/>',
      'chevron-down': '<path d="m6 9 6 6 6-6"/>',
      bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
      star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
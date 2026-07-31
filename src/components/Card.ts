// Refined manually. Do not overwrite.

import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'Card',
  standalone: true,
  template: `
    <div class="qml-card" [class]="rootClass()" [style.--qml-card-radius.px]="finalRadius()"
      [style.--qml-card-bg]="finalBackground()" [style.--qml-card-accent]="accentColorResolved()"
      [style.--qml-card-text]="finalTextColor()" (click)="handleClick()">
      @if (showAccentLine()) {
        <div class="qml-card-accent" [class]="'qml-card-accent-' + accentPosition()"></div>
      }
      <div class="qml-card-body" [style.padding.px]="padding()">
        @if (hasHeader()) {
          <div class="qml-card-header" [class.no-sep]="!headerSeparator()">
            @if (icon()) {
              <span class="qml-card-icon" [innerHTML]="iconSvg(icon(), 24)"></span>
            }
            <div class="qml-card-head-text">
              @if (title()) { <h3 class="qml-card-title">{{ title() }}</h3> }
              @if (subtitle()) { <p class="qml-card-subtitle">{{ subtitle() }}</p> }
            </div>
          </div>
        }
        <ng-content></ng-content>
        <div class="qml-card-footer" [class.no-sep]="!footerSeparator()" [class.hidden]="!hasFooter()">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qml-card {
      position: relative; overflow: hidden;
      border-radius: var(--qml-card-radius, 12px);
      background: var(--qml-card-bg, var(--ctp-base, #1e1e2e));
      color: var(--qml-card-text, var(--ctp-text, #cdd6f4));
      border: 1px solid transparent;
      font-family: var(--ctp-font-family, sans-serif);
      transition: transform 130ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 150ms ease;
    }
    .qml-card-outline { background: transparent; border-color: var(--ctp-surface1, #45475a); }
    .qml-card-tonal {
      background: color-mix(in srgb, var(--qml-card-accent, var(--ctp-mauve)) 15%, transparent);
    }
    .qml-card-filled { border: none; box-shadow: var(--ctp-shadow-sm); }
    .qml-card-accent-default { /* default: visual accent only */ }
    .qml-card-clickable { cursor: pointer; }
    .qml-card-clickable:hover { transform: scale(1.015); }
    .qml-card-clickable:active { transform: scale(0.985); }
    .qml-card-accent { position: absolute; background: var(--qml-card-accent, var(--ctp-mauve)); pointer-events: none; }
    .qml-card-accent-left { left: 0; top: 0; bottom: 0; width: 4px; }
    .qml-card-accent-top { top: 0; left: 0; right: 0; height: 4px; }
    .qml-card-body { padding: 16px; }
    .qml-card-header {
      display: flex; gap: 12px; padding-bottom: 12px; margin-bottom: 12px; align-items: center;
      border-bottom: 1px solid var(--ctp-surface0, #313244);
    }
    .qml-card-header.no-sep { padding-bottom: 0; margin-bottom: 0; border: none; }
    .qml-card-icon { display: inline-flex; flex-shrink: 0; color: var(--qml-card-accent); }
    .qml-card-head-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .qml-card-title { margin: 0; font-size: 16px; font-weight: 700; color: inherit; line-height: 1.3; }
    .qml-card-subtitle { margin: 0; font-size: 12px; color: var(--ctp-subtext0, #a6adc8); line-height: 1.3; }
    .qml-card-footer {
      padding-top: 12px; margin-top: 12px;
      border-top: 1px solid var(--ctp-surface0, #313244);
      display: flex; justify-content: flex-end; gap: 8px;
    }
    .qml-card-footer.no-sep { padding-top: 0; margin-top: 0; border: none; }
    .qml-card-footer.hidden { display: none; }
  `],
})
export class Card {
  title = input<string>(''); subtitle = input<string>(''); icon = input<string>('');
  variant = input<'default' | 'accent' | 'tonal' | 'outline' | 'filled'>('default');
  accentPosition = input<'left' | 'top' | 'none'>('left');
  clickable = input<boolean>(false);
  padding = input<number>(16);
  backgroundColor = input<string>('');
  customRadius = input<number>(-1);
  customColor = input<string>('transparent');
  customAccentColor = input<string>('transparent');
  customTextColor = input<string>('transparent');
  headerSeparator = input<boolean>(true);
  footerSeparator = input<boolean>(true);
  hasFooter = input<boolean>(false);
  clicked = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  protected finalRadius = computed(() => this.customRadius() >= 0 ? this.customRadius() : 12);
  protected showAccentLine = computed(() => this.variant() === 'accent' && this.accentPosition() !== 'none');
  protected hasHeader = computed(() => !!this.title() || !!this.subtitle() || !!this.icon());

  protected rootClass = computed(() => {
    const v = this.variant();
    const cls = ['qml-card', `qml-card-${v}`];
    if (this.clickable()) cls.push('qml-card-clickable');
    return cls.join(' ');
  });

  protected finalBackground = computed(() => {
    if (this.variant() === 'outline') return 'transparent';
    if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-base))`;
    if (this.customColor() !== 'transparent') return this.customColor();
    if (this.variant() === 'tonal') return `color-mix(in srgb, ${this.accentColorResolved()} 15%, transparent)`;
    return '';
  });

  protected finalTextColor = computed(() => {
    if (this.customTextColor() !== 'transparent') return this.customTextColor();
    return '';
  });

  protected accentColorResolved = computed(() => {
    if (this.customAccentColor() !== 'transparent') return this.customAccentColor();
    if (this.backgroundColor()) return `var(--ctp-${this.backgroundColor()}, var(--ctp-mauve))`;
    return 'var(--ctp-mauve)';
  });

  protected handleClick(): void { if (this.clickable()) this.clicked.emit(); }

  protected iconSvg(name: string, size: number): SafeHtml {
    const paths: Record<string, string> = {
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
      'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
      'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    };
    const path = paths[name] || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
    );
  }
}
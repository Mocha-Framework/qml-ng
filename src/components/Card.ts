// Refined manually. Do not overwrite.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Card',
  standalone: true,
  template: `
    <div class="qml-card" [class]="'qml-card-' + variant() + (clickable() ? ' qml-card-clickable' : '')"
      [style.--qml-card-accent]="accentColorResolved()" [style.padding.px]="padding()"
      (click)="handleClick()">
      @if (accentPosition() !== 'none') {
        <div class="qml-card-accent" [class]="'qml-card-accent-' + accentPosition()"></div>
      }
      @if (icon() || title() || subtitle()) {
        <div class="qml-card-header" [class.qml-card-header-no-sep]="!headerSeparator()">
          @if (icon(); as i) { <qml-icon [name]="i" size="20" /> }
          <div>
            @if (title(); as t) { <h3 class="qml-card-title">{{ t }}</h3> }
            @if (subtitle(); as s) { <p class="qml-card-subtitle">{{ s }}</p> }
          </div>
        </div>
      }
      <div class="qml-card-body"><ng-content></ng-content></div>
      <div class="qml-card-footer"><ng-content select="[footer]"></ng-content></div>
    </div>
  `,
  styles: [`
    .qml-card { background: var(--qml-base, #1e1e2e); border-radius: 12px; position: relative; overflow: hidden; }
    .qml-card-accent { position: absolute; background: var(--qml-card-accent, #cba6f7); }
    .qml-card-accent-left { left: 0; top: 0; bottom: 0; width: 4px; }
    .qml-card-accent-top { top: 0; left: 0; right: 0; height: 4px; }
    .qml-card-header { display: flex; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--qml-surface0, #313244); margin-bottom: 12px; }
    .qml-card-header-no-sep { border-bottom: none; margin-bottom: 0; }
    .qml-card-title { margin: 0; font-size: 16px; font-weight: 600; color: var(--qml-text, #cdd6f4); }
    .qml-card-subtitle { margin: 2px 0 0; font-size: 12px; color: var(--qml-subtext0, #a6adc8); }
    .qml-card-clickable { cursor: pointer; transition: transform 0.12s; }
    .qml-card-clickable:hover { transform: scale(1.015); }
    .qml-card-clickable:active { transform: scale(0.985); }
    .qml-card-outline { background: transparent; border: 1px solid var(--qml-surface0, #313244); }
    .qml-card-tonal { background: color-mix(in srgb, var(--qml-card-accent, #cba6f7) 15%, transparent); }
  `],
})
export class Card {
  title = input<string>(''); subtitle = input<string>(''); icon = input<string>('');
  variant = input<'default' | 'accent' | 'tonal' | 'outline' | 'filled'>('default');
  accentPosition = input<'left' | 'top' | 'none'>('left');
  clickable = input<boolean>(false); padding = input<number>(16);
  backgroundColor = input<string>(''); customRadius = input<number>(-1);
  customColor = input<string>('transparent'); customAccentColor = input<string>('transparent');
  customTextColor = input<string>('transparent'); headerSeparator = input<boolean>(true);
  footerSeparator = input<boolean>(true);
  clicked = output<void>();
  protected accentColorResolved = computed(() =>
    this.customAccentColor() !== 'transparent' ? this.customAccentColor() : '#cba6f7');
  protected handleClick(): void { if (this.clickable()) this.clicked.emit(); }
}

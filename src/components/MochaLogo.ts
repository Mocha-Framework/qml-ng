// Refined manually. Do not overwrite.

import { Component, input, signal, computed, effect, ElementRef, inject, OnInit } from '@angular/core';

const ASPECT = 133.19615 / 116.25877;

@Component({
  selector: 'MochaLogo',
  standalone: true,
  template: `
    <svg class="qml-mocha-logo" [attr.width]="size()" [attr.height]="finalHeight()"
      [attr.viewBox]="'0 0 116.25877 133.19615'" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet" [innerHTML]="pathContent()" aria-hidden="true"></svg>
  `,
  styles: [`
    :host { display: inline-block; line-height: 0; vertical-align: middle; }
    .qml-mocha-logo { display: block; color: var(--ctp-mauve, #cba6f7); }
    .qml-mocha-logo path { fill: currentColor; }
  `],
})
export class MochaLogo implements OnInit {
  size = input<number>(28);
  color = input<string>('');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly _rawSvg = signal<string>('');

  protected finalHeight = computed(() => this.size() * ASPECT);
  protected pathContent = computed(() => {
    const svg = this._rawSvg();
    if (!svg) return '<path d="M58,15 C90,15 100,55 95,90 C90,120 70,128 58,128 C46,128 26,120 21,90 C16,55 26,15 58,15 Z M58,30 C40,30 32,55 36,80 C39,98 50,108 58,108 C66,108 77,98 80,80 C84,55 76,30 58,30 Z" fill="currentColor"/>';
    const colored = svg.replace(/fill\s*=\s*["']currentColor["']/g, '');
    const matches = svg.match(/<path[^>]*\sd\s*=\s*["'][^"']+["'][^>]*>/g);
    if (!matches) return '';
    return matches.map(m => m.replace(/fill\s*=\s*["']currentColor["']/g, '')).join('');
  });

  constructor() {
    effect(() => {
      const c = this.color();
      if (c) {
        (this.host.nativeElement as HTMLElement).style.color = c;
      } else {
        (this.host.nativeElement as HTMLElement).style.removeProperty('color');
      }
    });
  }

  ngOnInit(): void {
    this.loadSvg();
  }

  private async loadSvg(): Promise<void> {
    if (typeof window === 'undefined') return;
    const candidates = [
      '/assets/logo/mocha-logo.svg',
      'assets/logo/mocha-logo.svg',
      './assets/logo/mocha-logo.svg',
    ];
    for (const url of candidates) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          this._rawSvg.set(text);
          return;
        }
      } catch (_) { /* try next */ }
    }
  }
}

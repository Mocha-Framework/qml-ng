// Refined manually. Do not overwrite.

import {
  Component, input, output, computed, signal, effect, ElementRef, inject, HostListener,
} from '@angular/core';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.trim();
  if (clean.startsWith('#')) clean = clean.slice(1);
  if (clean.length === 3) clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h /= 6;
  }
  return { h, s, v };
}

function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return rgbToHex(r * 255, g * 255, b * 255);
}

@Component({
  selector: 'CozyColorPicker',
  standalone: true,
  template: `
    @if (inline()) {
      <div class="qml-ccp qml-ccp-inline" [style.width.px]="280">
        <div class="qml-ccp-sv"
          [style.background]="'hsl(' + (currentHue() * 360) + ', 100%, 50%)'"
          (mousedown)="onSvMouseDown($event)">
          <div class="qml-ccp-sv-white"></div>
          <div class="qml-ccp-sv-black"></div>
          <div class="qml-ccp-sv-thumb"
            [style.left.%]="currentSaturation() * 100"
            [style.top.%]="(1 - currentValue()) * 100"></div>
        </div>
        <div class="qml-ccp-hue" (mousedown)="onHueMouseDown($event)">
          <div class="qml-ccp-hue-thumb" [style.left.%]="currentHue() * 100"></div>
        </div>
        <div class="qml-ccp-hex-row">
          <div class="qml-ccp-preview" [style.background]="colorValue()"></div>
          <input class="qml-ccp-input" type="text"
            [value]="hexText()"
            (input)="onHexInput($event)"
            (blur)="onHexBlur()" />
        </div>
      </div>
    } @else {
      <div class="qml-ccp-wrap">
        <div class="qml-ccp-trigger"
          [class.is-expanded]="_expanded()"
          [class.is-disabled]="disabled()"
          [class.is-up]="_openUpward()"
          (click)="togglePopover()">
          <div class="qml-ccp-preview-sm" [style.background]="colorValue()"></div>
          <input class="qml-ccp-input" type="text"
            [value]="hexText()"
            [disabled]="disabled()"
            (input)="onHexInput($event)"
            (blur)="onHexBlur()"
            (click)="$event.stopPropagation()" />
          <span class="qml-ccp-chevron" [class.rot]="_expanded()">▾</span>
        </div>
        @if (_expanded()) {
          <div class="qml-ccp-overlay" (click)="closePopover()"></div>
          <div class="qml-ccp-popup" [class.up]="_openUpward()">
            <div class="qml-ccp-sv"
              [style.background]="'hsl(' + (currentHue() * 360) + ', 100%, 50%)'"
              (mousedown)="onSvMouseDown($event)">
              <div class="qml-ccp-sv-white"></div>
              <div class="qml-ccp-sv-black"></div>
              <div class="qml-ccp-sv-thumb"
                [style.left.%]="currentSaturation() * 100"
                [style.top.%]="(1 - currentValue()) * 100"></div>
            </div>
            <div class="qml-ccp-hue" (mousedown)="onHueMouseDown($event)">
              <div class="qml-ccp-hue-thumb" [style.left.%]="currentHue() * 100"></div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: inline-block; font-family: inherit; }
    .qml-ccp-wrap { position: relative; display: inline-block; }
    .qml-ccp-inline {
      display: flex; flex-direction: column; gap: 12px;
      padding: 12px;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface0, #313244);
      border-radius: 18px;
      box-sizing: border-box;
    }
    .qml-ccp-sv {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: 12px;
      cursor: crosshair;
      overflow: hidden;
      user-select: none;
    }
    .qml-ccp-sv-white {
      position: absolute; inset: 0;
      background: linear-gradient(to right, #ffffff, rgba(255,255,255,0));
    }
    .qml-ccp-sv-black {
      position: absolute; inset: 0;
      background: linear-gradient(to top, #000000, rgba(0,0,0,0));
    }
    .qml-ccp-sv-thumb {
      position: absolute;
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(0,0,0,0.1);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .qml-ccp-hue {
      position: relative;
      width: 100%;
      height: 14px;
      border-radius: 9999px;
      cursor: ew-resize;
      background: linear-gradient(to right,
        #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%,
        #0000ff 67%, #ff00ff 83%, #ff0000 100%);
      user-select: none;
    }
    .qml-ccp-hue-thumb {
      position: absolute;
      top: -3px;
      width: 10px;
      height: 20px;
      transform: translateX(-50%);
      background: #ffffff;
      border: 1.5px solid var(--ctp-crust, #11111b);
      border-radius: 4px;
      pointer-events: none;
    }
    .qml-ccp-hex-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qml-ccp-preview {
      width: 44px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid var(--ctp-surface0, #313244);
      flex-shrink: 0;
    }
    .qml-ccp-input {
      flex: 1;
      height: 36px;
      padding: 0 8px;
      background: var(--ctp-base, #1e1e2e);
      border: 1px solid var(--ctp-surface0, #313244);
      border-radius: 6px;
      color: var(--ctp-text, #cdd6f4);
      font-family: inherit;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    }
    .qml-ccp-input:focus { border-color: var(--ctp-mauve, #cba6f7); }

    .qml-ccp-trigger {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 280px;
      height: 40px;
      padding: 0 8px;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface1, #45475a);
      border-radius: 12px;
      cursor: pointer;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    .qml-ccp-trigger.is-expanded { border: 2px solid var(--ctp-mauve, #cba6f7); padding: 0 7px; }
    .qml-ccp-trigger.is-disabled { background: var(--ctp-crust, #11111b); cursor: not-allowed; opacity: 0.7; }
    .qml-ccp-trigger:hover { border-color: var(--ctp-overlay0, #6c7086); }
    .qml-ccp-preview-sm {
      width: 24px; height: 24px;
      border-radius: 50%;
      border: 1px solid var(--ctp-surface2, #585b70);
      flex-shrink: 0;
    }
    .qml-ccp-chevron {
      margin-left: auto;
      color: var(--ctp-subtext0, #a6adc8);
      transition: transform 0.15s;
      font-size: 12px;
    }
    .qml-ccp-chevron.rot { transform: rotate(180deg); }

    .qml-ccp-overlay {
      position: fixed;
      inset: 0;
      z-index: 9998;
    }
    .qml-ccp-popup {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 9999;
      width: 280px;
      padding: 12px;
      background: var(--ctp-mantle, #181825);
      border: 1px solid var(--ctp-surface0, #313244);
      border-radius: 18px;
      box-sizing: border-box;
      display: flex; flex-direction: column; gap: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .qml-ccp-popup.up { top: auto; bottom: calc(100% + 4px); }
    .qml-ccp-popup .qml-ccp-sv { height: 140px; }
  `],
})
export class CozyColorPicker {
  colorValue = input<string>('#CBA6F7');
  inline = input<boolean>(false);
  disabled = input<boolean>(false);
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);

  colorChanged = output<{ newHex: string }>();

  protected readonly _hue = signal<number>(0.8);
  protected readonly _sat = signal<number>(0.33);
  protected readonly _val = signal<number>(0.97);
  protected readonly _expanded = signal<boolean>(false);
  protected readonly _openUpward = signal<boolean>(false);

  protected currentHue = this._hue.asReadonly();
  protected currentSaturation = this._sat.asReadonly();
  protected currentValue = this._val.asReadonly();

  protected hexText = computed(() => this.colorValue().toUpperCase());

  private dragTarget: 'sv' | 'hue' | null = null;
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const hex = this.colorValue();
      const rgb = hexToRgb(hex);
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        this._hue.set(hsv.h);
        this._sat.set(hsv.s);
        this._val.set(hsv.v);
      }
    });
    effect(() => {
      const e = this.expanded();
      this._expanded.set(e);
    });
    effect(() => {
      const u = this.openUpward();
      this._openUpward.set(u);
    });
  }

  protected togglePopover(): void {
    if (this.disabled()) return;
    if (!this._expanded()) {
      const rect = (this.host.nativeElement as HTMLElement).getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      this._openUpward.set(spaceBelow < 230);
    }
    this._expanded.set(!this._expanded());
  }

  protected closePopover(): void { this._expanded.set(false); }

  protected onSvMouseDown(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dragTarget = 'sv';
    this.applySvFromEvent(ev);
  }

  protected onHueMouseDown(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dragTarget = 'hue';
    this.applyHueFromEvent(ev);
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(ev: MouseEvent): void {
    if (!this.dragTarget) return;
    if (this.dragTarget === 'sv') this.applySvFromEvent(ev);
    else this.applyHueFromEvent(ev);
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void { this.dragTarget = null; }

  private applySvFromEvent(ev: MouseEvent): void {
    const el = ev.target as HTMLElement;
    const sv = el.closest('.qml-ccp-sv') as HTMLElement | null;
    if (!sv) return;
    const rect = sv.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (ev.clientY - rect.top) / rect.height));
    this._sat.set(s);
    this._val.set(v);
    this.emitColor();
  }

  private applyHueFromEvent(ev: MouseEvent): void {
    const el = ev.target as HTMLElement;
    const hue = el.closest('.qml-ccp-hue') as HTMLElement | null;
    if (!hue) return;
    const rect = hue.getBoundingClientRect();
    const h = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    this._hue.set(h);
    this.emitColor();
  }

  protected onHexInput(ev: Event): void {
    const value = (ev.target as HTMLInputElement).value.trim();
    const rgb = hexToRgb(value);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      this._hue.set(hsv.h);
      this._sat.set(hsv.s);
      this._val.set(hsv.v);
      this.colorChanged.emit({ newHex: value.toUpperCase() });
    }
  }

  protected onHexBlur(): void { /* noop */ }

  private emitColor(): void {
    const hex = hsvToHex(this._hue(), this._sat(), this._val());
    this.colorChanged.emit({ newHex: hex });
  }
}

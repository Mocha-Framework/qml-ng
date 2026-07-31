// Refined manually. Do not overwrite.

import { Component, input, output, computed, inject, ElementRef, signal, HostListener } from '@angular/core';
import { Router } from './Router';

@Component({
  selector: 'RouterLink',
  standalone: true,
  template: `
    <a class="qml-router-link"
      [class.is-active]="isActive()"
      [class.is-hovered]="_hovered()"
      [style.color]="currentColor()"
      [attr.href]="href()"
      (click)="onClick($event)"
      (mouseenter)="_hovered.set(true)"
      (mouseleave)="_hovered.set(false)">
      @if (text() || icon()) {
        <span class="qml-router-link-inner">
          @if (icon()) { <span class="qml-router-link-icon" aria-hidden="true">{{ icon() }}</span> }
          @if (text()) { <span class="qml-router-link-text">{{ text() }}</span> }
        </span>
      }
      <ng-content></ng-content>
    </a>
  `,
  styles: [`
    :host { display: inline-flex; }
    .qml-router-link {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.15s;
      user-select: none;
    }
    .qml-router-link:focus-visible {
      outline: 2px solid var(--ctp-mauve, #cba6f7);
      outline-offset: 2px;
      border-radius: 4px;
    }
    .qml-router-link-inner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .qml-router-link-icon { font-size: 16px; }
    .qml-router-link-text { font-size: 14px; }
  `],
})
export class RouterLink {
  to = input<string>('');
  params = input<Record<string, string>>({});
  router = input<Router | null>(null);
  action = input<'push' | 'replace' | 'reset'>('push');
  text = input<string>('');
  icon = input<string>('');
  activeColor = input<string>('var(--ctp-mauve, #cba6f7)');
  inactiveColor = input<string>('var(--ctp-text, #cdd6f4)');

  private readonly _hovered = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>);

  private _injectedRouter: Router | null = null;

  protected readonly isActive = computed(() => {
    const r = this._resolvedRouter();
    return r ? r.isActive(this.to()) : false;
  });

  protected readonly currentColor = computed(() => {
    if (this.isActive()) return this.activeColor();
    if (this._hovered()) return 'var(--ctp-subtext1, #b8c0e0)';
    return this.inactiveColor();
  });

  protected readonly href = computed(() => {
    const to = this.to();
    return to || '#';
  });

  private _resolvedRouter(): Router | null {
    const r = this.router();
    if (r) return r;
    if (this._injectedRouter) return this._injectedRouter;
    this._injectedRouter = this._findAncestorRouter();
    return this._injectedRouter;
  }

  private _findAncestorRouter(): Router | null {
    let node: HTMLElement | null = (this.host.nativeElement as HTMLElement).parentElement;
    while (node) {
      const ctx = (node as unknown as { __ngContext__?: unknown }).__ngContext__;
      if (ctx) {
        const found = this._searchRouterInContext(ctx);
        if (found) return found;
      }
      node = node.parentElement;
    }
    return null;
  }

  private _searchRouterInContext(ctx: unknown): Router | null {
    let cur: unknown = ctx;
    while (cur) {
      const inst = (cur as { instance?: unknown }).instance;
      if (inst instanceof Router) return inst;
      cur = (cur as { parent?: unknown }).parent;
    }
    return null;
  }

  protected onClick(ev: MouseEvent): void {
    ev.preventDefault();
    const r = this._resolvedRouter();
    if (!r) {
      console.warn(`RouterLink: no Router found for "${this.to()}"`);
      return;
    }
    const a = this.action();
    if (a === 'replace') r.replace(this.to(), this.params());
    else if (a === 'reset') r.reset(this.to(), this.params());
    else r.push(this.to(), this.params());
  }
}

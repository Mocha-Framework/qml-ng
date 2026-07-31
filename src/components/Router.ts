// Refined manually. Do not overwrite.

import {
  Component, input, output, computed, signal, ContentChildren, QueryList,
  AfterContentInit, ChangeDetectorRef, inject, ViewContainerRef, ViewChild,
  ElementRef, TemplateRef, EmbeddedViewRef, OnDestroy,
} from '@angular/core';
import { Route, CanActivateFn, CanDeactivateFn } from './Route';

interface RouteEntry { path: string; params: Record<string, string>; title: string; }

interface RouteDef {
  path: string;
  source: string;
  view: unknown;
  title: string;
  canActivate: CanActivateFn | null;
  canDeactivate: CanDeactivateFn | null;
  guardRedirect: string;
}

@Component({
  selector: 'Router',
  standalone: true,
  template: `
    <div class="qml-router" [style.opacity]="loaderOpacity()"
      [style.transition]="'opacity ' + (transitionDuration() / 2) + 'ms ease'">
      <ng-container #routeHost></ng-container>
      @if (!_hasView()) {
        <div class="qml-router-empty">
          <span>404 — Rota não encontrada</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .qml-router { width: 100%; height: 100%; position: relative; }
    .qml-router-empty {
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%;
      color: var(--ctp-surface2, #585b70);
      font-size: 14px;
    }
  `],
})
export class Router implements AfterContentInit, OnDestroy {
  initialRoute = input<string>('/');
  transitionDuration = input<number>(220);
  notFoundComponent = input<unknown>(null);
  onRouteLeave = input<((path: string) => void) | null>(null);
  onRouteEnter = input<((path: string) => void) | null>(null);

  navigationStarted = output<{ path: string; params: Record<string, string> }>();
  navigationFinished = output<{ path: string; params: Record<string, string> }>();
  routeNotFound = output<{ path: string }>();
  navigationBlocked = output<{ path: string; reason: string }>();

  @ContentChildren(Route, { descendants: true })
  private routeChildren!: QueryList<Route>;

  @ViewChild('routeHost', { read: ViewContainerRef, static: true })
  private routeHost!: ViewContainerRef;

  private readonly _stack = signal<RouteEntry[]>([]);
  private readonly _stackIndex = signal<number>(-1);
  private readonly _hasView = signal<boolean>(false);
  protected readonly loaderOpacity = signal<number>(0);

  readonly currentPath = computed(() => {
    const idx = this._stackIndex();
    const stack = this._stack();
    return idx >= 0 && idx < stack.length ? stack[idx].path : this.initialRoute();
  });

  readonly currentParams = computed(() => {
    const idx = this._stackIndex();
    const stack = this._stack();
    return idx >= 0 && idx < stack.length ? stack[idx].params : {};
  });

  readonly currentTitle = computed(() => {
    const idx = this._stackIndex();
    const stack = this._stack();
    return idx >= 0 && idx < stack.length ? stack[idx].title : '';
  });

  readonly canGoBack = computed(() => this._stackIndex() > 0);
  readonly canGoForward = computed(() => {
    const idx = this._stackIndex();
    return idx < this._stack().length - 1;
  });
  readonly historyLength = computed(() => this._stack().length);
  readonly historyIndex = computed(() => this._stackIndex());

  private viewRef: EmbeddedViewRef<unknown> | null = null;
  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    queueMicrotask(() => {
      this.loaderOpacity.set(1);
      this.cdr.detectChanges();
    });
    this.push(this.initialRoute());
  }

  ngOnDestroy(): void {
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  isActive(path: string): boolean {
    return this._matchPath(path, this.currentPath()) !== null;
  }

  push(path: string, extraParams: Record<string, string> = {}): void {
    const resolved = this._resolve(path, extraParams);
    if (!this._checkCanDeactivate()) return;
    if (!this._checkCanActivate(resolved.path, resolved.params)) return;
    this._fireRouteLeave(resolved.path);
    const stack = this._stack().slice(0, this._stackIndex() + 1);
    stack.push(resolved);
    this._stack.set(stack);
    this._stackIndex.set(stack.length - 1);
    this.navigationStarted.emit({ path: resolved.path, params: resolved.params });
    this._loadRoute();
  }

  replace(path: string, extraParams: Record<string, string> = {}): void {
    const resolved = this._resolve(path, extraParams);
    if (!this._checkCanActivate(resolved.path, resolved.params)) return;
    this._fireRouteLeave(resolved.path);
    const stack = this._stack().slice();
    const idx = this._stackIndex();
    if (idx >= 0 && idx < stack.length) {
      stack[idx] = resolved;
      this._stack.set(stack);
    } else {
      this._stack.set([resolved]);
      this._stackIndex.set(0);
    }
    this.navigationStarted.emit({ path: resolved.path, params: resolved.params });
    this._loadRoute();
  }

  back(): void {
    if (!this.canGoBack()) return;
    if (!this._checkCanDeactivate()) return;
    const prev = this._stack()[this._stackIndex() - 1];
    if (!this._checkCanActivate(prev.path, prev.params)) return;
    this._fireRouteLeave(prev.path);
    this._stackIndex.set(this._stackIndex() - 1);
    this.navigationStarted.emit({ path: this.currentPath(), params: this.currentParams() });
    this._loadRoute();
  }

  forward(): void {
    if (!this.canGoForward()) return;
    if (!this._checkCanDeactivate()) return;
    const next = this._stack()[this._stackIndex() + 1];
    if (!this._checkCanActivate(next.path, next.params)) return;
    this._fireRouteLeave(next.path);
    this._stackIndex.set(this._stackIndex() + 1);
    this.navigationStarted.emit({ path: this.currentPath(), params: this.currentParams() });
    this._loadRoute();
  }

  go(delta: number): void {
    const newIdx = this._stackIndex() + delta;
    if (newIdx < 0 || newIdx >= this._stack().length) return;
    if (!this._checkCanDeactivate()) return;
    const target = this._stack()[newIdx];
    if (!this._checkCanActivate(target.path, target.params)) return;
    this._fireRouteLeave(target.path);
    this._stackIndex.set(newIdx);
    this.navigationStarted.emit({ path: this.currentPath(), params: this.currentParams() });
    this._loadRoute();
  }

  reset(path: string, extraParams: Record<string, string> = {}): void {
    const resolved = this._resolve(path, extraParams);
    if (!this._checkCanDeactivate()) return;
    if (!this._checkCanActivate(resolved.path, resolved.params)) return;
    this._fireRouteLeave(resolved.path);
    this._stack.set([resolved]);
    this._stackIndex.set(0);
    this.navigationStarted.emit({ path: resolved.path, params: resolved.params });
    this._loadRoute();
  }

  private _checkCanActivate(path: string, params: Record<string, string>): boolean {
    const route = this._findRoute(path);
    if (!route || !route.canActivate) return true;
    const result = route.canActivate(params, this);
    if (!result) {
      this.navigationBlocked.emit({ path, reason: 'canActivate' });
      if (route.guardRedirect && this._cleanPath(route.guardRedirect) !== path) {
        this.push(route.guardRedirect);
      }
      return false;
    }
    return true;
  }

  private _checkCanDeactivate(): boolean {
    if (this._stack().length === 0) return true;
    const route = this._findRoute(this.currentPath());
    if (!route || !route.canDeactivate) return true;
    const result = route.canDeactivate(this.currentParams(), this);
    if (!result) {
      this.navigationBlocked.emit({ path: this.currentPath(), reason: 'canDeactivate' });
      return false;
    }
    return true;
  }

  private _fireRouteLeave(newPath: string): void {
    const cb = this.onRouteLeave();
    if (cb && this.currentPath() && this.currentPath() !== newPath) {
      cb(this.currentPath());
    }
  }

  private _cleanPath(path: string): string {
    if (path.length > 1 && path[path.length - 1] === '/') return path.slice(0, -1);
    return path;
  }

  private _resolve(path: string, extraParams: Record<string, string>): RouteEntry {
    const cleanedPath = this._cleanPath(path);
    const route = this._findRoute(cleanedPath);
    const title = route?.title ?? '';
    const extractedParams: Record<string, string> = {};
    if (route && route.path.indexOf(':') !== -1) {
      const m = this._matchPath(route.path, cleanedPath);
      if (m) Object.assign(extractedParams, m);
    }
    const finalParams: Record<string, string> = {};
    for (const k in extractedParams) finalParams[k] = extractedParams[k];
    for (const k2 in extraParams) finalParams[k2] = extraParams[k2];
    return { path: cleanedPath, params: finalParams, title };
  }

  private _findRoute(concretePath: string): RouteDef | null {
    let wildcard: RouteDef | null = null;
    for (const r of this._collectRoutes()) {
      if (r.path === '*') { wildcard = r; continue; }
      if (this._matchPath(r.path, concretePath) !== null) return r;
    }
    return wildcard;
  }

  private _collectRoutes(): RouteDef[] {
    if (!this.routeChildren) return [];
    return this.routeChildren.map(r => ({
      path: r.path(),
      source: r.source(),
      view: r.view(),
      title: r.title(),
      canActivate: r.canActivate(),
      canDeactivate: r.canDeactivate(),
      guardRedirect: r.guardRedirect(),
    }));
  }

  private _matchPath(pattern: string, concretePath: string): Record<string, string> | null {
    if (pattern === '*') return {};
    const paramNames: string[] = [];
    const regexStr = '^' + pattern.replace(/:[^/]+/g, (m) => {
      paramNames.push(m.slice(1));
      return '([^/]+)';
    }) + '$';
    const rx = new RegExp(regexStr);
    const match = concretePath.match(rx);
    if (!match) return null;
    const params: Record<string, string> = {};
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = match[i + 1];
    }
    return params;
  }

  private _loadRoute(): void {
    const route = this._findRoute(this.currentPath());
    if (!route) {
      this.routeNotFound.emit({ path: this.currentPath() });
      this._hasView.set(false);
      return;
    }
    if (this.transitionDuration() > 0) {
      this.loaderOpacity.set(0);
      setTimeout(() => {
        this._applyRoute(route);
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
          this.loaderOpacity.set(1);
          this.cdr.detectChanges();
        });
      }, this.transitionDuration() / 2);
    } else {
      this._applyRoute(route);
      this.loaderOpacity.set(1);
    }
  }

  private _applyRoute(route: RouteDef): void {
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
    if (!this.routeHost) {
      this.cdr.detectChanges();
      queueMicrotask(() => this._applyRoute(route));
      return;
    }
    const tpl = route.view as TemplateRef<unknown> | null;
    if (tpl && typeof (tpl as unknown as TemplateRef<unknown>).createEmbeddedView === 'function') {
      try {
        this.viewRef = this.routeHost.createEmbeddedView(tpl, {
          $implicit: this.currentParams(),
          params: this.currentParams(),
          router: this,
        });
        this._hasView.set(true);
      } catch (err) {
        console.warn('Router: failed to render template', err);
        this._hasView.set(false);
      }
    } else if (route.source) {
      console.warn('Router: source-based loading not supported in qml-ng (use view: TemplateRef)');
      this._hasView.set(false);
    } else {
      this._hasView.set(false);
    }
    this.navigationFinished.emit({ path: this.currentPath(), params: this.currentParams() });
    const enterCb = this.onRouteEnter();
    if (enterCb) enterCb(this.currentPath());
  }
}

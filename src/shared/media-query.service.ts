// Refined manually. Do not overwrite.
// Angular service exposing window-breakpoint signals as a singleton.

import { Injectable, signal, computed, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

@Injectable({ providedIn: 'root' })
export class MediaQueryService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly breakpoints: Breakpoints = DEFAULT_BREAKPOINTS;

  private readonly _windowWidth = signal<number>(0);
  private readonly _windowHeight = signal<number>(0);

  readonly windowWidth = this._windowWidth.asReadonly();
  readonly windowHeight = this._windowHeight.asReadonly();

  readonly isXs = computed(() => this._windowWidth() < this.breakpoints.sm);
  readonly isSm = computed(() => this._windowWidth() >= this.breakpoints.sm && this._windowWidth() < this.breakpoints.md);
  readonly isMd = computed(() => this._windowWidth() >= this.breakpoints.md && this._windowWidth() < this.breakpoints.lg);
  readonly isLg = computed(() => this._windowWidth() >= this.breakpoints.lg && this._windowWidth() < this.breakpoints.xl);
  readonly isXl = computed(() => this._windowWidth() >= this.breakpoints.xl);

  readonly isMobile = computed(() => this._windowWidth() < this.breakpoints.md);
  readonly isTablet = computed(() => this._windowWidth() >= this.breakpoints.md && this._windowWidth() < this.breakpoints.lg);
  readonly isDesktop = computed(() => this._windowWidth() >= this.breakpoints.lg);

  readonly activeBreakpoint = computed<'xs' | 'sm' | 'md' | 'lg' | 'xl'>(() => {
    if (this.isXs()) return 'xs';
    if (this.isSm()) return 'sm';
    if (this.isMd()) return 'md';
    if (this.isLg()) return 'lg';
    return 'xl';
  });

  private readonly onResize = () => {
    if (typeof window === 'undefined') return;
    this._windowWidth.set(window.innerWidth);
    this._windowHeight.set(window.innerHeight);
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
      this.zone.runOutsideAngular(() => {
        window.addEventListener('resize', this.onResize, { passive: true });
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }
}

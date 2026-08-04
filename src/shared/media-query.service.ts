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

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
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
  private readonly _isTouch = signal<boolean>(false);
  private readonly _prefersReducedMotion = signal<boolean>(false);
  private readonly _keyboardHeight = signal<number>(0);
  private readonly _safeAreaInsets = signal<SafeAreaInsets>({ top: 0, right: 0, bottom: 0, left: 0 });

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

  // ── Mobile extensions (mirror QML MediaQuery — see meta/mobile-gestures.md §7) ──
  readonly isTouchDevice = this._isTouch.asReadonly();
  readonly isCoarsePointer = this._isTouch.asReadonly();
  readonly prefersReducedMotion = this._prefersReducedMotion.asReadonly();
  readonly keyboardHeight = this._keyboardHeight.asReadonly();
  readonly safeAreaInsets = this._safeAreaInsets.asReadonly();

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

  private readonly mqCoarsePointer = computed(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(pointer: coarse)').matches
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
      this.zone.runOutsideAngular(() => {
        window.addEventListener('resize', this.onResize, { passive: true });

        // Touch / coarse pointer detection — falls back to coarse pointer
        // media query when window.matchMedia is unavailable.
        const coarseQuery = window.matchMedia('(pointer: coarse)');
        const hoverQuery = window.matchMedia('(hover: none)');
        const syncTouch = () => this._isTouch.set(coarseQuery.matches || hoverQuery.matches);
        syncTouch();
        coarseQuery.addEventListener('change', syncTouch);
        hoverQuery.addEventListener('change', syncTouch);

        // Reduced motion
        const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncRm = () => this._prefersReducedMotion.set(rmQuery.matches);
        syncRm();
        rmQuery.addEventListener('change', syncRm);

        // Safe area insets from CSS env() — read computed style once on
        // resize. (Browsers don't expose real insets as numbers; we read
        // the applied CSS env via getComputedStyle on a probe element.)
        this.refreshSafeAreaInsets();
      });
    }
  }

  /**
   * Reads CSS env(safe-area-inset-*) via a probe element. Called on
   * resize; consumers can also call manually after layout changes.
   */
  refreshSafeAreaInsets(): void {
    if (typeof document === 'undefined') return;
    const probe = document.createElement('div');
    probe.style.position = 'fixed';
    probe.style.top = 'env(safe-area-inset-top, 0)';
    probe.style.right = 'env(safe-area-inset-right, 0)';
    probe.style.bottom = 'env(safe-area-inset-bottom, 0)';
    probe.style.left = 'env(safe-area-inset-left, 0)';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const cs = getComputedStyle(probe);
    const parse = (v: string) => parseFloat(v) || 0;
    this._safeAreaInsets.set({
      top: parse(cs.top),
      right: parse(cs.right),
      bottom: parse(cs.bottom),
      left: parse(cs.left),
    });
    document.body.removeChild(probe);
  }

  /**
   * Stub for haptic feedback. On the web there's no first-class API; the
   * spec calls for `navigator.vibrate` (Android Chrome) which most desktop
   * browsers ignore. iOS Safari has no Vibration API; the implementation
   * will swap to a `mocha_nativeHaptic()` call when running inside the
   * QuickJS/Hermes bridge on iOS.
   *
   * See meta/mobile-gestures.md §4.
   */
  haptic(style: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' |
                'notificationSuccess' | 'notificationWarning' | 'notificationError'): void {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    const ms = style === 'impactHeavy' ? 30 :
               style === 'impactMedium' ? 20 :
               style === 'impactLight' ? 10 :
               style === 'notificationError' ? [40, 30, 40] :
               style === 'notificationWarning' ? [30, 20, 30] :
               style === 'notificationSuccess' ? [15, 10, 15] :
               5;
    navigator.vibrate(ms);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }
}

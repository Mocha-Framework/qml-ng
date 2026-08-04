// ── Gesture Mixins (qml-ng) ───────────────────────────────────────────────
//
// This file is intentionally a STUB. See meta/mobile-gestures.md §7 for the
// full qml-ng gesture plan.
//
// The QML implementation in `ds-qml/qml/MochaDS/{SwipeGesture,LongPressGesture,
// PinchGesture,EdgeSwipeGesture,PullToRefreshGesture}.qml` is the source of
// truth and ships in this milestone.
//
// qml-ng re-implements MochaDS components as Angular web components. The
// equivalent of the QML gesture mixins will be added here as Angular
// directives built on `@use-gesture/angular`:
//
//   SwipeDirective       — applies useSwipe() to the host element
//   LongPressDirective   — applies useLongPress() with haptic on commit
//   PinchDirective       — applies usePinch() with min/max clamping
//   PullToRefreshDirective — composes useDrag() with a Flickable-like
//                             container that emits `refresh` at threshold
//   EdgeSwipeDirective   — applies useDrag() restricted to a band near
//                             a given edge
//
// All five directives read `isTouchDevice` / `prefersReducedMotion` from
// the extended `MediaQueryService` (qml-ng/src/shared/media-query.service.ts)
// and call `mq.haptic(...)` for tactile feedback on commit.
//
// Status: TODOs only. Implementation deferred until we wire
// `@use-gesture/angular` into the qml-ng build (see meta/mobile-gestures.md
// §7 for the rationale).

import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mochaSwipe]',
  standalone: true,
  host: {
    'data-mocha-gesture': 'swipe',
  },
})
export class SwipeDirectiveStub {
  // TODO(meta/mobile-gestures.md §7): replace with @use-gesture/angular
  // useSwipe binding. For now this exists so consumers can write
  // `<div mochaSwipe (mochaSwipe)="..."></div>` and not get a compile error.
  readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    // No-op until the real implementation lands. Tracked in meta/mobile-gestures.md.
  }
}

@Directive({
  selector: '[mochaLongPress]',
  standalone: true,
  host: { 'data-mocha-gesture': 'longpress' },
})
export class LongPressDirectiveStub {
  readonly el = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[mochaPinch]',
  standalone: true,
  host: { 'data-mocha-gesture': 'pinch' },
})
export class PinchDirectiveStub {
  readonly el = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[mochaPullToRefresh]',
  standalone: true,
  host: { 'data-mocha-gesture': 'pull-to-refresh' },
})
export class PullToRefreshDirectiveStub {
  readonly el = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[mochaEdgeSwipe]',
  standalone: true,
  host: { 'data-mocha-gesture': 'edge-swipe' },
})
export class EdgeSwipeDirectiveStub {
  readonly el = inject(ElementRef<HTMLElement>);
}
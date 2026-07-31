// Refined manually. Do not overwrite.

import { Component, inject, computed } from '@angular/core';
import { MediaQueryService } from '../shared/media-query.service';

@Component({
  selector: 'MediaQuery',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MediaQuery {
  private readonly mq = inject(MediaQueryService);

  readonly windowWidth = this.mq.windowWidth;
  readonly windowHeight = this.mq.windowHeight;
  readonly isXs = this.mq.isXs;
  readonly isSm = this.mq.isSm;
  readonly isMd = this.mq.isMd;
  readonly isLg = this.mq.isLg;
  readonly isXl = this.mq.isXl;
  readonly isMobile = this.mq.isMobile;
  readonly isTablet = this.mq.isTablet;
  readonly isDesktop = this.mq.isDesktop;
  readonly activeBreakpoint = this.mq.activeBreakpoint;

  readonly breakpoints = computed(() => ({
    xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280,
  }));
}

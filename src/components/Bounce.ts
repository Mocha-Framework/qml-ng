// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'Bounce', standalone: true,
  template: `<div class="motion" [class.is-visible]="trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--from-scale]="fromScale()"><ng-content /></div>`,
  styles: [`:host{display:inline-block}.motion{opacity:0;transform:scale(var(--from-scale));}.motion.is-visible{animation:bounce-in var(--duration) cubic-bezier(.22,1,.36,1) var(--delay) both}@keyframes bounce-in{0%{opacity:0;transform:scale(var(--from-scale))}55%{opacity:1;transform:scale(1.12)}75%{transform:scale(.96)}100%{opacity:1;transform:scale(1)}}`]
})
export class Bounce { duration=input(600); delay=input(0); fromScale=input(0.5); trigger=input(true); }

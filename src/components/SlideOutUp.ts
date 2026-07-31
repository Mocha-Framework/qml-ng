// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'SlideOutUp',standalone:true,template:`<div class="motion" [class.is-hidden]="!trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--offset.px]="offset()"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion.is-hidden{animation:slide-out-up var(--duration) cubic-bezier(.55,.055,.675,.19) var(--delay) both}@keyframes slide-out-up{to{transform:translateY(calc(-1 * var(--offset)))}}`]})
export class SlideOutUp {duration=input(350);delay=input(0);offset=input(20);trigger=input(true)}

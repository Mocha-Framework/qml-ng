// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'SlideRight',standalone:true,template:`<div class="motion" [class.is-visible]="trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--offset.px]="offset()"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion{opacity:0;transform:translateX(calc(-1 * var(--offset)))}.motion.is-visible{animation:slide-right var(--duration) cubic-bezier(.215,.61,.355,1) var(--delay) both}@keyframes slide-right{to{opacity:1;transform:translateX(0)}}`]})
export class SlideRight {duration=input(400);delay=input(0);offset=input(20);trigger=input(true)}

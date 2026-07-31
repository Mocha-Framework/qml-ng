// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'SlideDown',standalone:true,template:`<div class="motion" [class.is-visible]="trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--offset.px]="offset()"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion{opacity:0;transform:translateY(calc(-1 * var(--offset)))}.motion.is-visible{animation:slide-down var(--duration) cubic-bezier(.215,.61,.355,1) var(--delay) both}@keyframes slide-down{to{opacity:1;transform:translateY(0)}}`]})
export class SlideDown {duration=input(400);delay=input(0);offset=input(20);trigger=input(true)}

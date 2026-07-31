// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'FadeOut',standalone:true,template:`<div class="motion" [class.is-hidden]="!trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion{opacity:1}.motion.is-hidden{animation:fade-out var(--duration) ease-in var(--delay) both}@keyframes fade-out{to{opacity:0}}`]})
export class FadeOut {duration=input(300);delay=input(0);trigger=input(true)}

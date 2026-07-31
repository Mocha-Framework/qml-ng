// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'Flip',standalone:true,template:`<div class="motion" [class.is-visible]="trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--angle]="clockwise() ? '90deg' : '-90deg'"><ng-content /></div>`,styles:[`:host{display:inline-block;perspective:800px}.motion{opacity:0;transform:rotateY(var(--angle));transform-origin:center}.motion.is-visible{animation:flip-in var(--duration) cubic-bezier(.215,.61,.355,1) var(--delay) both}@keyframes flip-in{to{opacity:1;transform:rotateY(0)}}`]})
export class Flip {duration=input(500);delay=input(0);clockwise=input(false);trigger=input(true)}

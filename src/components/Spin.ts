// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'Spin',standalone:true,template:`<div class="motion" [class.is-visible]="trigger()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()" [style.--rotation]="fromRotation() + 'deg'"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion{opacity:0;transform:rotate(var(--rotation));transform-origin:center}.motion.is-visible{animation:spin-once var(--duration) cubic-bezier(.215,.61,.355,1) var(--delay) both}@keyframes spin-once{to{opacity:1;transform:rotate(0)}}`]})
export class Spin {duration=input(500);delay=input(0);fromRotation=input(-180);trigger=input(true)}

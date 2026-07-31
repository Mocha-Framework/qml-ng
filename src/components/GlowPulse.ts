// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';
@Component({selector:'GlowPulse',standalone:true,template:`<div class="glow" [style.--color]="color()" [style.--min]="pulseMin()" [style.--max]="pulseMax()" [style.--duration.ms]="duration()"><ng-content /></div>`,styles:[`:host{display:inline-block}.glow{position:relative}.glow:before,.glow:after{content:'';position:absolute;pointer-events:none;border-radius:calc(var(--qml-radius-md,8px) + 4px);animation:glow-pulse var(--duration) ease-in-out infinite}.glow:before{inset:-4px;border:2px solid var(--color);box-shadow:0 0 10px var(--color)}.glow:after{inset:0;border:1px solid color-mix(in srgb,var(--color) 40%,transparent)}@keyframes glow-pulse{0%,100%{opacity:var(--min)}50%{opacity:var(--max)}}`]})
export class GlowPulse {color=input('var(--qml-primary, #8839ef)');pulseMin=input(.3);pulseMax=input(1);duration=input(1500)}

// Refined manually. Do not overwrite.

import { AfterViewInit, Component, ElementRef, OnDestroy, input, signal } from '@angular/core';

@Component({selector:'FadeIn',standalone:true,template:`<div class="motion" [class.is-visible]="visible()" [style.--duration.ms]="duration()" [style.--delay.ms]="delay()"><ng-content /></div>`,styles:[`:host{display:inline-block}.motion{opacity:0}.motion.is-visible{animation:fade-in var(--duration) ease-out var(--delay) both}@keyframes fade-in{to{opacity:1}}`]})
export class FadeIn implements AfterViewInit,OnDestroy { duration=input(300);delay=input(0);trigger=input(true);triggerOnVisibility=input(false);visibilityThreshold=input(.3);visible=signal(false);private observer?:IntersectionObserver;constructor(private el:ElementRef<HTMLElement>){}ngAfterViewInit(){if(this.triggerOnVisibility()){this.observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){this.visible.set(true);this.observer?.disconnect()}},{threshold:this.visibilityThreshold()});this.observer.observe(this.el.nativeElement)}else this.visible.set(this.trigger())}ngOnDestroy(){this.observer?.disconnect()} }

// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

type Spacing = string | number | undefined;
@Component({
  selector:'Box', standalone:true,
  template:`<div class="qml-box" [class]="'qml-box ' + variant()" [style.background]="background()" [style.padding]="padding()" [style.margin]="margin()"><ng-content></ng-content></div>`,
  styles:[`.qml-box { box-sizing:border-box; border-radius:8px; } .surface { background:var(--ctp-surface0, #313244); } .elevated { background:var(--ctp-mantle, #181825); } .outline { border:1px solid var(--ctp-surface1, #45475a); }`],
})
export class Box {
  p=input<Spacing>();px=input<Spacing>();py=input<Spacing>();pt=input<Spacing>();pr=input<Spacing>();pb=input<Spacing>();pl=input<Spacing>();m=input<Spacing>();mx=input<Spacing>();my=input<Spacing>();mt=input<Spacing>();mr=input<Spacing>();mb=input<Spacing>();ml=input<Spacing>();variant=input<'default'|'surface'|'elevated'|'outline'>('default');colorName=input<string>('');
  protected padding=computed(()=>this.edges(this.p(),this.px(),this.py(),this.pt(),this.pr(),this.pb(),this.pl())); protected margin=computed(()=>this.edges(this.m(),this.mx(),this.my(),this.mt(),this.mr(),this.mb(),this.ml())); protected background=computed(()=>this.colorName()?`var(--ctp-${this.colorName()}, transparent)`:null);
  private space(value:Spacing):number { if(typeof value==='number')return value; return ({none:0,xs:4,sm:8,md:16,lg:24,xl:32,xxl:48} as Record<string,number>)[value??'']??0; } private edges(all:Spacing,x:Spacing,y:Spacing,t:Spacing,r:Spacing,b:Spacing,l:Spacing):string { const top=this.space(t??y??all),right=this.space(r??x??all),bottom=this.space(b??y??all),left=this.space(l??x??all); return `${top}px ${right}px ${bottom}px ${left}px`; }
}

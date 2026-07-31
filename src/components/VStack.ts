// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'VStack', standalone: true,
  host: { '[style.display]': '"flex"', '[style.flex-direction]': 'reverse() ? "column-reverse" : "column"', '[style.column-gap.px]': 'gapX()', '[style.row-gap.px]': 'gapY()', '[style.justify-content]': 'justifyCSS()', '[style.align-items]': 'alignCSS()', '[style.align-content]': 'alignContentCSS()', '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"' },
  template: `<ng-content></ng-content>`,
  styles: [`:host { box-sizing:border-box; } :host ::ng-deep > [fillY], :host ::ng-deep > [fill] { flex:1 1 0; min-height:0; } :host ::ng-deep > [fillX], :host ::ng-deep > [fill] { align-self:stretch; }`],
})
export class VStack {
  spacing=input<number>(16); spacingX=input<number>(-1); spacingY=input<number>(-1); justifyContent=input<string>('start'); alignItems=input<string>('stretch'); wrap=input<boolean>(false); reverse=input<boolean>(false); alignContent=input<string>('start');
  protected gapX=computed(()=>this.spacingX()>=0?this.spacingX():this.spacing()); protected gapY=computed(()=>this.spacingY()>=0?this.spacingY():this.spacing()); protected justifyCSS=computed(()=>this.flex(this.justifyContent())); protected alignCSS=computed(()=>this.cross(this.alignItems(),'stretch')); protected alignContentCSS=computed(()=>this.cross(this.alignContent(),'flex-start'));
  private flex(value:string):string { return ({start:'flex-start',center:'center',end:'flex-end',between:'space-between',around:'space-around',evenly:'space-evenly'} as Record<string,string>)[value]??'flex-start'; } private cross(value:string,fallback:string):string { return ({start:'flex-start',center:'center',end:'flex-end',stretch:'stretch',between:'space-between',around:'space-around',evenly:'space-evenly'} as Record<string,string>)[value]??fallback; }
}

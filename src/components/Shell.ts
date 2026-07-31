// Refined manually. Do not overwrite.

import { Component, computed, input, model } from '@angular/core';

@Component({
  selector:'Shell', standalone:true,
  host:{'[style.--qml-shell-sidebar.px]':'sidebarSize()','[style.--qml-shell-secondary.px]':'secondarySidebarWidth()','[style.--qml-shell-header.px]':'headerHeight()','[style.--qml-shell-footer.px]':'footerHeight()','[style.--qml-shell-gap.px]':'columnSpacing()','[style.--qml-shell-bg]':'backgroundColor()'},
  template:`
    <div class="qml-shell" [class.mobile]="mobile()">
      @if(headerVisible()){<header><ng-content select="[shellHeader]"></ng-content><span class="default-title">Mocha App</span></header>}
      @if(sidebarVisible()){<aside class="primary"><ng-content select="[shellSidebar]"></ng-content></aside>}
      @if(secondarySidebarVisible()){<aside class="secondary"><ng-content select="[shellSecondarySidebar]"></ng-content></aside>}
      <main [style.grid-template-columns]="columnTemplate()">
        <section [class.hidden-mobile]="mobile() && activeMobileColumn() !== 0"><ng-content select="[shellCol1]"></ng-content><ng-content></ng-content></section>
        @if(columnCount()>=2){<section [class.hidden-mobile]="mobile() && activeMobileColumn() !== 1"><ng-content select="[shellCol2]"></ng-content></section>}
        @if(columnCount()>=3){<section [class.hidden-mobile]="mobile() && activeMobileColumn() !== 2"><ng-content select="[shellCol3]"></ng-content></section>}
      </main>
      @if(footerVisible()){<footer><ng-content select="[shellFooter]"></ng-content></footer>}
      @if(mobile()&&sidebarOpenMobile()){<button class="backdrop" (click)="sidebarOpenMobile.set(false)"></button><aside class="drawer"><ng-content select="[shellSidebar]"></ng-content></aside>}
    </div>`,
  styles:[`.qml-shell{width:100%;height:100%;min-width:0;min-height:0;position:relative;display:grid;grid-template-areas:"header header header" "sidebar secondary main" "footer footer footer";grid-template-columns:var(--qml-shell-sidebar) var(--qml-shell-secondary) 1fr;grid-template-rows:var(--qml-shell-header) 1fr var(--qml-shell-footer);background:var(--qml-shell-bg,var(--ctp-crust,#11111b));overflow:hidden}.qml-shell>header{grid-area:header;display:flex;align-items:center;padding:0 16px;background:var(--ctp-mantle,#181825);border-bottom:1px solid var(--ctp-surface0,#313244)}.default-title{color:var(--ctp-text);font:700 16px var(--ctp-font-family,sans-serif)}header:has(> :not(.default-title)) .default-title{display:none}.primary{grid-area:sidebar;background:var(--ctp-mantle,#181825);border-right:1px solid var(--ctp-surface0,#313244);overflow:hidden}.secondary{grid-area:secondary;background:var(--ctp-base,#1e1e2e);border-right:1px solid var(--ctp-surface0,#313244);overflow:hidden}main{grid-area:main;min-width:0;min-height:0;padding:24px;display:grid;gap:var(--qml-shell-gap);overflow:auto}main>section{min-width:0}.qml-shell>footer{grid-area:footer;background:var(--ctp-mantle,#181825);border-top:1px solid var(--ctp-surface0,#313244)}.mobile{grid-template-areas:"header" "main" "footer";grid-template-columns:1fr}.mobile>.primary,.mobile>.secondary{display:none}.hidden-mobile{display:none}.backdrop{position:absolute;inset:0;z-index:20;border:0;background:#0008}.drawer{display:block!important;position:absolute;inset:0 auto 0 0;width:var(--qml-shell-sidebar);z-index:21;background:var(--ctp-mantle);animation:drawer-in 250ms ease-out}@keyframes drawer-in{from{transform:translateX(-100%)}to{transform:none}}`],
})
export class Shell {
  sidebarWidth=input(240);secondarySidebarWidth=input(200);headerHeight=input(56);footerHeight=input(48);headerVisible=input(true);footerVisible=input(false);sidebarVisible=input(true);secondarySidebarVisible=input(false);sidebarCollapsed=input(false);sidebarShowBackground=input(true);secondarySidebarShowBackground=input(true);sidebarOpenMobile=model(false);columnCount=input(1);columnSpacing=input(24);columnRatio1=input(0);columnRatio2=input(0);columnRatio3=input(0);activeMobileColumn=input(0);isReady=input(false);breakpointMd=input(768);breakpointLg=input(1024);backgroundColor=input('var(--ctp-crust, #11111b)');viewportWidth=input(1024);
  protected mobile=computed(()=>this.viewportWidth()<this.breakpointMd());protected sidebarSize=computed(()=>!this.sidebarVisible()||this.mobile()?0:this.sidebarCollapsed()?64:this.sidebarWidth());protected columnTemplate=computed(()=>{if(this.mobile())return'1fr';const n=Math.min(3,Math.max(1,this.columnCount())),ratios=[this.columnRatio1(),this.columnRatio2(),this.columnRatio3()].slice(0,n);if(ratios.every(x=>x===0))return`repeat(${n}, minmax(0, 1fr))`;return ratios.map(x=>`${x>0?x:1}fr`).join(' ');});
}

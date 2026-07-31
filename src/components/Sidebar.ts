// Refined manually. Do not overwrite.

import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'Sidebar', standalone: true,
  host: { '[style.width.px]': 'hostWidth()', '[style.--qml-sidebar-expanded.px]': 'expandedWidth()', '[style.--qml-sidebar-collapsed.px]': 'collapsedWidth()' },
  template: `
    <aside class="qml-sidebar" [class.floated]="variant() === 'floated'" [class.collapsed]="isCollapsed()" [class.expand-hover]="expandOnHover()">
      <div class="qml-sidebar-header-slot"><ng-content select="SidebarHeader,[sidebarHeader]"></ng-content></div>
      <div class="qml-sidebar-section-slot"><ng-content select="SidebarSection,[sidebarSection]"></ng-content><ng-content select="SidebarItem"></ng-content></div>
      <div class="qml-sidebar-footer-slot"><ng-content select="SidebarFooter,[sidebarFooter]"></ng-content></div>
    </aside>
  `,
  styles: [`
    :host { display:block; height:600px; flex:none; transition:width 250ms ease-in-out; } .qml-sidebar { width:100%; height:100%; box-sizing:border-box; display:flex; flex-direction:column; overflow:hidden; color:var(--ctp-text, #cdd6f4); background:var(--ctp-crust, #11111b); border-right:1px solid var(--ctp-surface0, #313244); transition:width 250ms ease-in-out, box-shadow 180ms, border-radius 180ms; }
    .qml-sidebar.floated { width:calc(100% - 24px); height:calc(100% - 24px); margin:12px; border:0; border-radius:12px; background:var(--ctp-mantle, #181825); box-shadow:0 2px 3px rgb(0 0 0 / .15), 0 6px 12px rgb(0 0 0 / .08); }
    .qml-sidebar.collapsed.expand-hover:hover { width:var(--qml-sidebar-expanded); position:relative; z-index:100; box-shadow:0 10px 24px rgb(0 0 0 / .22); }
    .qml-sidebar-header-slot,.qml-sidebar-footer-slot { flex:none; } .qml-sidebar-section-slot { min-height:0; flex:1; display:flex; flex-direction:column; overflow:hidden; }
  `],
})
export class Sidebar {
  variant = input<'fixed' | 'floated'>('fixed'); isCollapsed = model<boolean>(false); expandOnHover = input<boolean>(false); collapsedWidth = input<number>(68); expandedWidth = input<number>(260);
  protected hostWidth = computed(() => this.isCollapsed() ? this.collapsedWidth() : this.expandedWidth());
}

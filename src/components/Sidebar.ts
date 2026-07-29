// Auto-generated from design-system/MochaDS/Sidebar.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { SidebarComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Sidebar',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"sidebar"',
  },
  template: `<ng-content></ng-content>`,
})
export class Sidebar {
  variant = input<string>("fixed");
  isCollapsed = input<boolean>(false);
  expandOnHover = input<boolean>(false);
  collapsedWidth = input<number>(68);
  expandedWidth = input<number>(260);
  currentWidth = input<number>(0);


  
}

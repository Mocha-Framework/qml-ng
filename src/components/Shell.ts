// Auto-generated from design-system/MochaDS/Shell.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { ShellComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Shell',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"shell"',
  },
  template: `<ng-content></ng-content>`,
})
export class Shell {
  sidebarWidth = input<number>(240);
  secondarySidebarWidth = input<number>(200);
  headerHeight = input<number>(56);
  footerHeight = input<number>(48);
  headerVisible = input<boolean>(true);
  footerVisible = input<boolean>(false);
  sidebarVisible = input<boolean>(true);
  secondarySidebarVisible = input<boolean>(false);
  sidebarCollapsed = input<boolean>(false);
  sidebarShowBackground = input<boolean>(false);
  secondarySidebarShowBackground = input<boolean>(false);
  sidebarOpenMobile = input<boolean>(false);
  columnCount = input<number>(1);
  columnSpacing = input<number>(16);
  columnRatio1 = input<number>(0);
  columnRatio2 = input<number>(0);
  columnRatio3 = input<number>(0);
  activeMobileColumn = input<number>(0);
  isReady = input<boolean>(false);
  breakpointMd = input<number>(768);
  breakpointLg = input<number>(1024);
  backgroundColor = input<string>("");


  
}

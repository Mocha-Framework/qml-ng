// Auto-generated from design-system/MochaDS/Badge.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { BadgeComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Badge',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"badge"',
  },
  template: `<ng-content></ng-content>`,
})
export class Badge {
  text = input<string>("");
  variant = input<string>("filled");
  color = input<string>("mauve");
  size = input<string>("md");
  shape = input<string>("pill");
  icon = input<string>("");
  isDismissible = input<boolean>(false);
  showDot = input<boolean>(false);
  customRadius = input<number>(-1);
  customColor = input<string>("transparent");
  customTextColor = input<string>("transparent");
  customBgColor = input<string>("transparent");

  dismissed = output<void>();

  
}

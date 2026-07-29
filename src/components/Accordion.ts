// Auto-generated from design-system/MochaDS/Accordion.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { CptAccordionComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Accordion',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"accordion"',
  },
  template: `<ng-content></ng-content>`,
})
export class Accordion {
  title = input<string>("");
  icon = input<string>("");
  expanded = input<boolean>(false);
  variant = input<string>("default");
  interactive = input<boolean>(true);
  accentColor = input<string>("mauve");
  backgroundColor = input<string>("");
  customRadius = input<number>(-1);
  customColor = input<string>("transparent");
  customAccentColor = input<string>("transparent");
  customTextColor = input<string>("transparent");

  toggled = output<{ isExpanded: boolean }>();

  
}

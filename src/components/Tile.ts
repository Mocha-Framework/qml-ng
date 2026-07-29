// Auto-generated from design-system/MochaDS/Tile.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { TileComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Tile',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"tile"',
  },
  template: `<ng-content></ng-content>`,
})
export class Tile {
  title = input<string>("");
  description = input<string>("");
  icon = input<string>("");
  rightIcon = input<string>("");
  variant = input<string>("default");
  active = input<boolean>(false);
  interactive = input<boolean>(true);
  draggable = input<boolean>(false);
  dragKey = input<string>("mochads-tile");
  backgroundColor = input<string>("");
  customRadius = input<number>(-1);
  customColor = input<string>("transparent");
  customAccentColor = input<string>("transparent");
  customTextColor = input<string>("transparent");

  clicked = output<void>();

  
}

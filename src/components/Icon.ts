// Manually written Icon component for qml-ng
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'qml-icon',
  standalone: true,
  template: `
    <span class="qml-icon" [style.width.px]="size()" [style.height.px]="size()" [style.color]="color()">
      {{ name() }}
    </span>
  `,
  styles: [`:host { display: inline-flex; align-items: center; justify-content: center; }`],
})
export class Icon {
  name = input<string>('');
  size = input<number>(18);
  color = input<string>('currentColor');
}

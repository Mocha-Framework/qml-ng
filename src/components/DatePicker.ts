// Auto-generated from design-system/MochaDS/DatePicker.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { DatePickerComponent } from '@mocha-ds/angular';

@Component({
  selector: 'DatePicker',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"datepicker"',
  },
  template: `<ng-content></ng-content>`,
})
export class DatePicker {
  selectedDate = input<unknown>(null);
  placeholder = input<string>("");
  format = input<string>("dd/MM/yyyy");
  disabled = input<boolean>(false);
  size = input<string>("md");
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
  viewMonth = input<number>(0);
  viewYear = input<number>(0);
  calendarDays = input<unknown>([]);


  
}

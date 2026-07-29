// Auto-generated from design-system/MochaDS/Button.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { ButtonComponent } from '@mocha-ds/angular';

@Component({
  selector: 'qml-button',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"button"',
  },
  template: `
    <button
      [attr.data-variant]="resolvedVariant()"
      [attr.data-color]="resolvedColor()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [disabled]="disabled() || isLoading()"
      (click)="handleClick()"
    >
      @if (leftIcon(); as icon) {
        <qml-icon [name]="icon"></qml-icon>
      }
      {{ text() }}
      @if (rightIcon(); as icon) {
        <qml-icon [name]="icon"></qml-icon>
      }
      <ng-content></ng-content>
    </button>`,
})
export class Button {
  text = input<string>("");
  variant = input<string>("primary");
  color = input<string>("mauve");
  size = input<string>("md");
  shape = input<string>("rounded");
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  leftIcon = input<string>("");
  rightIcon = input<string>("");
  icon = input<string>("");
  iconRight = input<boolean>(false);
  customRadius = input<number>(-1);
  customColor = input<string>("transparent");
  customTextColor = input<string>("transparent");

  clicked = output<void>();


  protected resolvedVariant = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'filled', secondary: 'outline', danger: 'filled',
      success: 'filled', warning: 'filled', info: 'filled',
    };
    return semantic[this.variant()] ?? this.variant();
  });

  protected resolvedColor = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'mauve', danger: 'red', success: 'green',
      warning: 'yellow', info: 'sky', secondary: 'surface0',
    };
    return semantic[this.variant()] ?? this.color();
  });

  
  protected handleClick(): void {
    if (!this.disabled() && !this.isLoading()) {
      this.clicked.emit();
    }
  }

}

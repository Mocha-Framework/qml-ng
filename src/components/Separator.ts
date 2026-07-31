// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'Separator',
  standalone: true,
  template: `
    <div class="qml-separator" [attr.data-orientation]="orientation()" [attr.data-variant]="variant()" role="separator"></div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-separator { background: var(--ctp-surface1, #45475a); flex-shrink: 0; }
    .qml-separator[data-orientation="horizontal"] { width: 100%; height: 1px; margin: 8px 0; }
    .qml-separator[data-orientation="vertical"] { width: 1px; height: 100%; align-self: stretch; margin: 0 8px; }
    .qml-separator[data-variant="subtle"] { background: var(--ctp-surface0, #313244); }
    .qml-separator[data-variant="strong"] { background: var(--ctp-surface2, #585b70); }
    .qml-separator[data-variant="accent"] { background: var(--ctp-mauve, #cba6f7); }
  `],
})
export class Separator {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  variant = input<'default' | 'subtle' | 'strong' | 'accent'>('default');
}

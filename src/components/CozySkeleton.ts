// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'CozySkeleton',
  standalone: true,
  template: `
    <span class="qml-skeleton" [attr.data-variant]="variant()" [attr.data-size]="size()"
      [style.width]="width()" [style.height]="height()"
      [class.full]="fullWidth()"></span>
  `,
  styles: [`
    :host { display: inline-block; font-family: var(--ctp-font-family); vertical-align: middle; }
    .qml-skeleton { display: block; border-radius: 6px;
      background: linear-gradient(90deg, var(--ctp-surface0, #313244) 25%, var(--ctp-surface1, #45475a) 50%, var(--ctp-surface0, #313244) 75%);
      background-size: 200% 100%; animation: qml-skeleton-shimmer 1.5s ease-in-out infinite; }
    .qml-skeleton[data-variant="text"] { height: 1em; border-radius: 4px; }
    .qml-skeleton[data-variant="circle"] { border-radius: 50%; aspect-ratio: 1; }
    .qml-skeleton[data-variant="rect"] { border-radius: 8px; }
    .qml-skeleton[data-size="sm"] { height: 0.5rem; }
    .qml-skeleton[data-size="md"] { height: 1rem; }
    .qml-skeleton[data-size="lg"] { height: 1.5rem; }
    .qml-skeleton[data-size="xl"] { height: 2.5rem; }
    .qml-skeleton.full { width: 100%; }
    @keyframes qml-skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `],
})
export class CozySkeleton {
  variant = input<'text' | 'circle' | 'rect'>('rect');
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'custom'>('md');
  width = input<string>('');
  height = input<string>('');
  fullWidth = input<boolean>(false);
}

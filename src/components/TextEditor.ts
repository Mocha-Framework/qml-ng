// Refined manually. Do not overwrite.

import { Component, input, model, signal, computed, ViewChild, ElementRef, AfterViewInit, output } from '@angular/core';

@Component({
  selector: 'TextEditor',
  standalone: true,
  template: `
    <div class="qml-text-editor" [class.is-focused]="focused()" [class.has-error]="!!errorText()">
      @if (label(); as lbl) {
        <label class="qml-text-editor-label">{{ lbl }}</label>
      }
      <div class="qml-text-editor-wrapper">
        <textarea #ta class="qml-text-editor-area" [value]="value()" [placeholder]="placeholder()"
          [readOnly]="readOnly()" [disabled]="disabled()"
          (input)="onInput($event)" (focus)="focused.set(true)" (blur)="focused.set(false)"></textarea>
        <div class="qml-text-editor-scrollbar"><div class="qml-text-editor-thumb" [style.height.%]="thumbHeight()" [style.top.%]="thumbTop()"></div></div>
      </div>
      @if (errorText(); as err) { <p class="qml-text-editor-error">{{ err }}</p> }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-text-editor { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .qml-text-editor-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-text-editor-wrapper { position: relative; background: var(--ctp-surface0, #313244);
      border: 1.5px solid var(--ctp-surface2, #585b70); border-radius: 12px; overflow: hidden;
      transition: border-color 0.18s ease, box-shadow 0.18s ease; min-height: 110px; }
    .qml-text-editor:hover .qml-text-editor-wrapper { border-color: var(--ctp-overlay1, #7f849c); }
    .qml-text-editor.is-focused .qml-text-editor-wrapper { border-color: var(--ctp-mauve, #cba6f7);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ctp-mauve, #cba6f7) 18%, transparent); }
    .qml-text-editor.has-error .qml-text-editor-wrapper { border-color: var(--ctp-red, #f38ba8); }
    .qml-text-editor-area { width: 100%; min-height: 110px; resize: vertical; padding: 12px 14px;
      border: none; outline: none; background: transparent; color: var(--ctp-text, #cdd6f4);
      font-family: inherit; font-size: 0.95rem; line-height: 1.55; box-sizing: border-box; padding-right: 20px; }
    .qml-text-editor-area::placeholder { color: var(--ctp-overlay0, #6e738d); }
    .qml-text-editor-scrollbar { position: absolute; right: 4px; top: 4px; bottom: 4px; width: 4px;
      background: var(--ctp-surface2, #585b70); border-radius: 9999px; opacity: 0.5; }
    .qml-text-editor-thumb { position: absolute; left: 0; right: 0; background: var(--ctp-overlay0, #6e738d); border-radius: 9999px; min-height: 12px; }
    .qml-text-editor-error { margin: 0; font-size: 0.78rem; color: var(--ctp-red, #f38ba8); }
  `],
})
export class TextEditor implements AfterViewInit {
  value = model<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  readOnly = input<boolean>(false);
  disabled = input<boolean>(false);
  errorText = input<string>('');

  changed = output<string>();

  protected focused = signal(false);
  @ViewChild('ta') protected ta?: ElementRef<HTMLTextAreaElement>;

  protected thumbHeight = computed(() => 100);
  protected thumbTop = computed(() => 0);

  ngAfterViewInit(): void {
    const el = this.ta?.nativeElement;
    if (!el) return;
    const update = () => {
      const ratio = el.clientHeight / el.scrollHeight;
      this.thumbHeight = computed(() => Math.max(12, ratio * 100));
      this.thumbTop = computed(() => (el.scrollTop / el.scrollHeight) * 100);
    };
    el.addEventListener('scroll', update);
    update();
  }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.changed.emit(v);
  }
}

// Refined manually. Do not overwrite.

import { Component, input, model, signal, computed, ViewChild, ElementRef, AfterViewInit, output, ViewEncapsulation } from '@angular/core';

interface ToolbarAction {
  name: string; icon: string; prefix: string; suffix: string; label: string;
}

@Component({
  selector: 'AdvancedTextEditor',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="qml-adv-editor" [attr.data-color]="color()">
      @if (label(); as lbl) { <label class="qml-adv-editor-label">{{ lbl }}</label> }
      <div class="editor">
        <div class="editor-toolbar">
          <button type="button" class="editor-toolbar-btn" (click)="format('**','**')" title="Negrito"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('_','_')" title="Itálico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('~~','~~')" title="Tachado"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg></button>
          <span class="editor-toolbar-separator"></span>
          <button type="button" class="editor-toolbar-btn" (click)="format('# ','')" title="Título"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('- ','')" title="Lista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('[',']()')" title="Link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('\`','\`')" title="Código"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></button>
          <button type="button" class="editor-toolbar-btn" (click)="format('> ','')" title="Citação"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg></button>
          <span class="editor-toolbar-separator"></span>
          <select class="editor-toolbar-select" (change)="onModeChange($event)" [value]="mode()">
            <option value="visual">Visual</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
        <div class="editor-content">
          @if (mode() === 'visual') {
            <div class="editor-prosemirror-wrapper">
              <div #content class="ProseMirror" contenteditable="true" (input)="onContentInput($event)" (blur)="onBlur()" [attr.data-placeholder]="placeholder()"></div>
            </div>
          } @else {
            <textarea class="editor-markdown" [value]="markdownValue()" (input)="onMarkdownInput($event)" [placeholder]="placeholder()"></textarea>
          }
        </div>
        <div class="editor-statusbar">
          <div class="editor-statusbar-left">
            <span class="editor-statusbar-badge">{{ wordCount() }} palavras</span>
            <span class="editor-statusbar-badge">{{ charCount() }} caracteres</span>
          </div>
          <div class="editor-statusbar-right">
            <span class="editor-statusbar-badge">Markdown</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-adv-editor { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .qml-adv-editor-label { font-size: 0.88rem; font-weight: 600; color: var(--ctp-subtext1, #bac2de); }
    .qml-adv-editor .editor { --ctp-editor-accent: var(--ctp-mauve, #cba6f7); }
    .qml-adv-editor[data-color="blue"] .editor { --ctp-editor-accent: var(--ctp-blue); }
    .qml-adv-editor[data-color="green"] .editor { --ctp-editor-accent: var(--ctp-green); }
    .qml-adv-editor[data-color="red"] .editor { --ctp-editor-accent: var(--ctp-red); }
    .qml-adv-editor[data-color="lavender"] .editor { --ctp-editor-accent: var(--ctp-lavender); }
  `],
})
export class AdvancedTextEditor implements AfterViewInit {
  value = model<string>('');
  label = input<string>('');
  placeholder = input<string>('Comece a escrever...');
  color = input<string>('mauve');
  height = input<number>(260);

  changed = output<string>();

  protected mode = signal<'visual' | 'markdown'>('visual');
  protected markdownValue = signal<string>('');

  @ViewChild('content') protected content?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (this.mode() === 'visual' && this.content) {
      this.content.nativeElement.innerText = this.value();
    } else {
      this.markdownValue.set(this.value());
    }
  }

  protected wordCount = computed(() => {
    const v = this.mode() === 'visual' ? (this.content?.nativeElement?.innerText ?? '') : this.markdownValue();
    return v.trim() ? v.trim().split(/\s+/).length : 0;
  });
  protected charCount = computed(() => {
    const v = this.mode() === 'visual' ? (this.content?.nativeElement?.innerText ?? '') : this.markdownValue();
    return v.length;
  });

  protected format(prefix: string, suffix: string): void {
    const ta = this.content?.nativeElement;
    if (!ta) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selected = range.toString();
    const replacement = prefix + selected + suffix;
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    this.onContentInput();
  }

  protected onContentInput(_event?: Event): void {
    const text = this.content?.nativeElement?.innerText ?? '';
    this.value.set(text);
    this.changed.emit(text);
  }

  protected onMarkdownInput(event: Event): void {
    const v = (event.target as HTMLTextAreaElement).value;
    this.markdownValue.set(v);
    this.value.set(v);
    this.changed.emit(v);
  }

  protected onBlur(): void { this.onContentInput(); }
  protected onModeChange(event: Event): void {
    const v = (event.target as HTMLSelectElement).value as 'visual' | 'markdown';
    if (v === 'visual' && this.content) {
      this.content.nativeElement.innerText = this.markdownValue() || this.value();
    } else {
      this.markdownValue.set(this.value());
    }
    this.mode.set(v);
  }
}

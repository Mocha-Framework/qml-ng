// Refined manually. Do not overwrite.

import { Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type Validator = (value: any) => string | null;
export type ValidatorRule = { validator: Validator; message: string };

@Injectable({ providedIn: 'root' })
export class FormControllerService {
  private fields = new Map<string, { value: any; rules: ValidatorRule[] }>();
  private values$ = new Subject<Record<string, any>>();
  private errors$ = new Subject<Record<string, string | null>>();
  private valid$ = new Subject<boolean>();

  private _values = signal<Record<string, any>>({});
  private _errors = signal<Record<string, string | null>>({});
  private _valid = signal<boolean>(true);

  register(id: string, initialValue: any, rules: ValidatorRule[] = []): void {
    this.fields.set(id, { value: initialValue, rules });
    this._values.update(v => ({ ...v, [id]: initialValue }));
    this.validate(id);
  }

  unregister(id: string): void { this.fields.delete(id); }

  setValue(id: string, value: any): void {
    const f = this.fields.get(id);
    if (!f) return;
    f.value = value;
    this._values.update(v => ({ ...v, [id]: value }));
    this.validate(id);
  }

  getValue(id: string): any { return this.fields.get(id)?.value; }

  validate(id?: string): boolean {
    const ids = id ? [id] : Array.from(this.fields.keys());
    let allValid = true;
    const newErrors: Record<string, string | null> = { ...this._errors() };
    for (const k of ids) {
      const f = this.fields.get(k); if (!f) continue;
      let err: string | null = null;
      for (const rule of f.rules) {
        const result = rule.validator(f.value);
        if (result !== null) { err = rule.message; break; }
      }
      newErrors[k] = err;
      if (err) allValid = false;
    }
    this._errors.set(newErrors);
    this._valid.set(allValid);
    this.errors$.next(newErrors);
    this.valid$.next(allValid);
    return allValid;
  }

  values(): Record<string, any> { return this._values(); }
  errors(): Record<string, string | null> { return this._errors(); }
  isValid(): boolean { return this._valid(); }

  reset(): void {
    for (const [k, f] of this.fields) {
      this._values.update(v => ({ ...v, [k]: f.value }));
    }
    this.validate();
  }

  onValuesChange(): Observable<Record<string, any>> { return this.values$.asObservable(); }
  onErrorsChange(): Observable<Record<string, string | null>> { return this.errors$.asObservable(); }
  onValidChange(): Observable<boolean> { return this.valid$.asObservable(); }
}

@Component({
  selector: 'qml-form-field',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class FormFieldDirective {
  @Input('qmlFormField') id!: string;
  @Input() rules: ValidatorRule[] = [];
  constructor(public host: ElementRef, private ctrl: FormControllerService) {}
  ngOnInit(): void {
    if (this.id) this.ctrl.register(this.id, '', this.rules);
  }
  ngOnDestroy(): void { if (this.id) this.ctrl.unregister(this.id); }
}

@Component({
  selector: 'Form',
  standalone: true,
  template: `
    <form class="qml-form" (ngSubmit)="onSubmit($event)" novalidate>
      <ng-content></ng-content>
    </form>
  `,
  styles: [`
    :host { display: block; font-family: var(--ctp-font-family); }
    .qml-form { display: flex; flex-direction: column; gap: 16px; }
  `],
})
export class Form {
  submitted = new EventEmitter<Record<string, any>>();
  reset$ = new EventEmitter<void>();
  constructor(public ctrl: FormControllerService) {}
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.ctrl.validate()) this.submitted.emit(this.ctrl.values());
  }
  reset(): void { this.ctrl.reset(); this.reset$.emit(); }
}

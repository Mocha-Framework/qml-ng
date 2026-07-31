// Refined manually. Do not overwrite.

import { Component, Input, Output, EventEmitter, Injectable, signal } from '@angular/core';

// Note: Validator / ValidatorRule types are owned by Form.ts to avoid duplicate
// exports through `export *` in index.ts. Re-imported here when needed.
import type { Validator, ValidatorRule } from './Form';

@Injectable({ providedIn: 'root' })
export class FormController {
  private fields = new Map<string, { value: any; rules: ValidatorRule[] }>();
  private _values = signal<Record<string, any>>({});
  private _errors = signal<Record<string, string | null>>({});
  private _valid = signal<boolean>(true);

  register(id: string, initialValue: any = '', rules: ValidatorRule[] = []): void {
    this.fields.set(id, { value: initialValue, rules });
    this._values.update(v => ({ ...v, [id]: initialValue }));
    this._errors.update(e => ({ ...e, [id]: null }));
    this.validate(id);
  }
  unregister(id: string): void {
    this.fields.delete(id);
    this._values.update(v => { const n = { ...v }; delete n[id]; return n; });
    this._errors.update(e => { const n = { ...e }; delete n[id]; return n; });
  }

  setValue(id: string, value: any): void {
    const f = this.fields.get(id); if (!f) return;
    f.value = value;
    this._values.update(v => ({ ...v, [id]: value }));
    this.validate(id);
  }
  getValue(id: string): any { return this.fields.get(id)?.value; }

  validate(id?: string): boolean {
    const ids = id ? [id] : Array.from(this.fields.keys());
    let ok = true;
    const errs = { ...this._errors() };
    for (const k of ids) {
      const f = this.fields.get(k); if (!f) continue;
      let err: string | null = null;
      for (const r of f.rules) {
        const m = r.validator(f.value);
        if (m !== null) { err = r.message; break; }
      }
      errs[k] = err;
      if (err) ok = false;
    }
    this._errors.set(errs);
    this._valid.set(ok);
    return ok;
  }

  values(): Record<string, any> { return this._values(); }
  errors(): Record<string, string | null> { return this._errors(); }
  isValid(): boolean { return this._valid(); }
  reset(): void { for (const [, f] of this.fields) { f.value = ''; } this._values.set({}); this.validate(); }

  static required(message = 'Campo obrigatório'): ValidatorRule {
    return { validator: (v: any) => (v == null || v === '' ? 'invalid' : null), message };
  }
  static minLength(n: number, message?: string): ValidatorRule {
    return { validator: (v: any) => (typeof v === 'string' && v.length < n ? 'invalid' : null), message: message ?? `Mínimo ${n} caracteres` };
  }
  static maxLength(n: number, message?: string): ValidatorRule {
    return { validator: (v: any) => (typeof v === 'string' && v.length > n ? 'invalid' : null), message: message ?? `Máximo ${n} caracteres` };
  }
  static pattern(regex: RegExp, message = 'Formato inválido'): ValidatorRule {
    return { validator: (v: any) => (typeof v === 'string' && !regex.test(v) ? 'invalid' : null), message };
  }
  static custom(fn: (v: any) => boolean, message = 'Inválido'): ValidatorRule {
    return { validator: (v: any) => (!fn(v) ? 'invalid' : null), message };
  }
}

@Component({
  selector: 'FormController',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class FormControllerComponent {
  @Input() fieldId = '';
  @Input() rules: ValidatorRule[] = [];
  constructor(public ctrl: FormController) {}
  ngOnInit(): void { if (this.fieldId) this.ctrl.register(this.fieldId, '', this.rules); }
  ngOnDestroy(): void { if (this.fieldId) this.ctrl.unregister(this.fieldId); }
}

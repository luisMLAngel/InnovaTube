import { signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MESSAGES } from '../../core/constants';

export abstract class FormBase<F extends { [K in keyof F]: AbstractControl<any, any> }, P, RC, RU> {
  protected abstract _form: FormGroup<F>;
  showErrorSignal: WritableSignal<boolean> = signal<boolean>(false);
  protected abstract createForm(): FormGroup<F>;

  populateForm(data: P): void {
    this._form.setValue(data as any);
  }
  abstract toResponseForCreate(): RC;

  toResponseForUpdate(): RU {
    throw new Error('toResponseForUpdate not implemented');
  }

  validateFormAndThrow(): void {
    this._form.markAllAsTouched();
    this._form.markAllAsDirty();
    if (this._form.invalid) {
      this.showErrorSignal.set(true);
      throw new Error(MESSAGES.FORM.INVALID_FORM);
    }
    this.showErrorSignal.set(false);
  }
  validateForm(): void {
    this._form.markAllAsTouched();
    this._form.markAllAsDirty();
    this.showErrorSignal.set(this._form.invalid);
  }
  setShowError(value: boolean): void {
    this.showErrorSignal.set(value);
  }
  abstract reset(): void;
  get form(): FormGroup<F> {
    return this._form;
  }
}

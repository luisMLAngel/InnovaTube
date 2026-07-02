import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormBase } from '../../../shared/interfaces';
import {
  ResetPasswordFormGroup,
  ResetPasswordPopulateForm,
  ResetPasswordResponse,
} from '../forms';

@Injectable({ providedIn: 'root' })
export class ResetPasswordFormService extends FormBase<
  ResetPasswordFormGroup,
  ResetPasswordPopulateForm,
  ResetPasswordResponse,
  ResetPasswordResponse
> {
  _form: FormGroup<ResetPasswordFormGroup>;

  passwordSignal: Signal<string | null>;

  constructor() {
    super();
    this._form = this.createForm();
    this.passwordSignal = toSignal(this._form.get('password')!.valueChanges, {
      initialValue: this._form.get('password')!.value,
    });
  }

  createForm(): FormGroup<ResetPasswordFormGroup> {
    this._form = new FormGroup<ResetPasswordFormGroup>(
      {
        password: new FormControl<string | null>(null, {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: new FormControl<string | null>(null, {
          validators: [Validators.required, Validators.minLength(8)],
        }),
      },
      { validators: this.passwordMatchValidator },
    );
    return this._form;
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  toResponseForCreate(): ResetPasswordResponse {
    const formValue = this._form.value;
    return {
      password: formValue.password ?? '',
      confirmPassword: formValue.confirmPassword ?? '',
    };
  }

  reset(): void {
    this._form.reset({
      password: null,
      confirmPassword: null,
    });
    this.setShowError(false);
  }

  get passwordControl(): FormControl<string | null> {
    return this._form.get('password') as FormControl<string | null>;
  }

  get confirmPasswordControl(): FormControl<string | null> {
    return this._form.get('confirmPassword') as FormControl<string | null>;
  }
}

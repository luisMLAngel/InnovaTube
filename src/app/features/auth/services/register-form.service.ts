import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormBase } from '../../../shared/interfaces';
import { RegisterFormGroup, RegisterPopulateForm, RegisterResponse } from '../forms';

@Injectable({ providedIn: 'root' })
export class RegisterFormService extends FormBase<
  RegisterFormGroup,
  RegisterPopulateForm,
  Omit<RegisterResponse, 'recaptchaToken'>,
  RegisterResponse
> {
  _form: FormGroup<RegisterFormGroup>;

  passwordSignal: Signal<string | null>;
  constructor() {
    super();
    this._form = this.createForm();
    this.passwordSignal = toSignal(this._form.get('password')!.valueChanges, {
      initialValue: this._form.get('password')!.value,
    });
  }

  createForm(): FormGroup<RegisterFormGroup> {
    this._form = new FormGroup<RegisterFormGroup>(
      {
        name: new FormControl<string | null>(null, {
          validators: [Validators.required],
        }),
        lastname: new FormControl<string | null>(null, {
          validators: [Validators.required],
        }),
        email: new FormControl<string | null>(null, {
          validators: [Validators.required, Validators.email],
        }),
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

  toResponseForCreate(): Omit<RegisterResponse, 'recaptchaToken'> {
    const formValue = this._form.value;
    return {
      firstName: formValue.name ?? '',
      lastName: formValue.lastname ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
    };
  }

  reset(): void {
    this._form.reset({
      name: null,
      lastname: null,
      email: null,
      password: null,
      confirmPassword: null,
    });
    this.setShowError(false);
  }

  get nameControl(): FormControl<string | null> {
    return this._form.get('name') as FormControl<string | null>;
  }

  get lastnameControl(): FormControl<string | null> {
    return this._form.get('lastname') as FormControl<string | null>;
  }

  get emailControl(): FormControl<string | null> {
    return this._form.get('email') as FormControl<string | null>;
  }

  get passwordControl(): FormControl<string | null> {
    return this._form.get('password') as FormControl<string | null>;
  }

  get confirmPasswordControl(): FormControl<string | null> {
    return this._form.get('confirmPassword') as FormControl<string | null>;
  }
}

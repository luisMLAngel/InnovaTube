import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBase } from '../../../shared/interfaces';
import { LoginFormGroup, LoginPopulateForm, LoginResponse } from '../forms';

@Injectable({ providedIn: 'root' })
export class LoginFormService extends FormBase<
  LoginFormGroup,
  LoginPopulateForm,
  LoginResponse,
  LoginResponse
> {
  _form: FormGroup<LoginFormGroup>;

  constructor() {
    super();
    this._form = this.createForm();
  }

  createForm(): FormGroup<LoginFormGroup> {
    this._form = new FormGroup<LoginFormGroup>({
      email: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
    });
    return this._form;
  }

  toResponseForCreate(): LoginResponse {
    const formValue = this._form.value;
    return {
      email: formValue.email ?? '',
      password: formValue.password ?? '',
    };
  }

  reset(): void {
    this._form.reset({
      email: null,
      password: null,
    });
    this.setShowError(false);
  }
}

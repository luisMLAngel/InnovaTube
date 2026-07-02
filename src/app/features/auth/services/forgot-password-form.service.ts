import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBase } from '../../../shared/interfaces';
import {
  ForgotPasswordFormGroup,
  ForgotPasswordPopulateForm,
  ForgotPasswordResponse,
} from '../forms';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordFormService extends FormBase<
  ForgotPasswordFormGroup,
  ForgotPasswordPopulateForm,
  ForgotPasswordResponse,
  ForgotPasswordResponse
> {
  _form: FormGroup<ForgotPasswordFormGroup>;

  constructor() {
    super();
    this._form = this.createForm();
  }

  createForm(): FormGroup<ForgotPasswordFormGroup> {
    this._form = new FormGroup<ForgotPasswordFormGroup>({
      email: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.email],
      }),
    });
    return this._form;
  }

  toResponseForCreate(): ForgotPasswordResponse {
    const formValue = this._form.value;
    return {
      email: formValue.email ?? '',
    };
  }

  reset(): void {
    this._form.reset({
      email: null,
    });
    this.setShowError(false);
  }
}

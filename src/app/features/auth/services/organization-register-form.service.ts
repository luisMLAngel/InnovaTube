import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBase } from '../../../shared/interfaces';
import {
  OrganizationRegisterFormGroup,
  OrganizationRegisterPopulateForm,
  OrganizationRegisterResponse,
} from '../forms';

@Injectable({ providedIn: 'root' })
export class OrganizationRegisterFormService extends FormBase<
  OrganizationRegisterFormGroup,
  OrganizationRegisterPopulateForm,
  OrganizationRegisterResponse,
  OrganizationRegisterResponse
> {
  _form: FormGroup<OrganizationRegisterFormGroup>;

  constructor() {
    super();
    this._form = this.createForm();
  }

  createForm(): FormGroup<OrganizationRegisterFormGroup> {
    this._form = new FormGroup<OrganizationRegisterFormGroup>({
      name: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
    });
    return this._form;
  }

  toResponseForCreate(): OrganizationRegisterResponse {
    const formValue = this._form.value;
    return {
      name: formValue.name ?? '',
    };
  }

  reset(): void {
    this._form.reset({
      name: null,
    });
    this.setShowError(false);
  }

  get nameControl(): FormControl<string | null> {
    return this._form.get('name') as FormControl<string | null>;
  }
}

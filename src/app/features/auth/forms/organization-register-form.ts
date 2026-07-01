import { FormControl } from '@angular/forms';

export type OrganizationRegisterFormGroup = {
  name: FormControl<string | null>;
};

export type OrganizationRegisterPopulateForm = {
  name: string;
};

export type OrganizationRegisterResponse = {
  name: string;
};

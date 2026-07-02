import { FormControl } from '@angular/forms';

export type ForgotPasswordFormGroup = {
  email: FormControl<string | null>;
};

export type ForgotPasswordPopulateForm = {
  email: string;
};

export type ForgotPasswordResponse = {
  email: string;
};

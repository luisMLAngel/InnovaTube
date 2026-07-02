import { FormControl } from '@angular/forms';

export type ResetPasswordFormGroup = {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
};

export type ResetPasswordPopulateForm = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordResponse = {
  password: string;
  confirmPassword: string;
};

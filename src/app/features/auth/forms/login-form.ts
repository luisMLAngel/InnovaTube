import { FormControl } from '@angular/forms';

export type LoginFormGroup = {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

export type LoginPopulateForm = {
  email: string;
  password: string;
};

export type LoginResponse = {
  email: string;
  password: string;
};

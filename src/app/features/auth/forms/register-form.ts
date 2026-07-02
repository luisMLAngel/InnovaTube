import { FormControl } from '@angular/forms';

export type RegisterFormGroup = {
  name: FormControl<string | null>;
  lastname: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

export type RegisterPopulateForm = {
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

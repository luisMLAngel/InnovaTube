import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormErrorDirective } from '../../../../shared/directives/control-error.directive';
import { PasswordFeedbackComponent } from '../../components';
import { AuthFacadeService, RegisterFormService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  styles: [``],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PasswordFeedbackComponent,
    FormErrorDirective,
  ],
  providers: [],
})
export class RegisterPage {
  // Services
  protected readonly formService: RegisterFormService = inject(RegisterFormService);
  private readonly authFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  constructor() {}

  async onRegister(): Promise<void> {
    this.formService.validateFormAndThrow();
    const registerData = this.formService.toResponseForCreate();
    await this.authFacadeService.registerUser(registerData);
    await this.router.navigate(['auth', 'organization']);
  }
}

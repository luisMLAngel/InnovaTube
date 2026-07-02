import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormErrorDirective } from '../../../../shared/directives/control-error.directive';
import { AuthFacadeService, LoginFormService } from '../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styles: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormErrorDirective,
  ],
  providers: [],
})
export class LoginPage {
  // Services
  protected readonly formService: LoginFormService = inject(LoginFormService);
  protected readonly messageService: MessageService = inject(MessageService);
  private readonly authFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  constructor() {}

  async onLogin(): Promise<void> {
    try {
      this.formService.validateFormAndThrow();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
      return;
    }
    const loginData = this.formService.toResponseForCreate();
    try {
      await this.authFacadeService.login(loginData);
      await this.router.navigate(['/videos']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormErrorDirective } from '../../../../shared/directives/control-error.directive';
import { AuthFacadeService, LoginFormService } from '../../services';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordFormService } from '../../services/forgot-password-form.service';
@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password.page.html',
  styles: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormErrorDirective,
    RouterLink,
  ],
  providers: [],
})
export class ResetPasswordPage implements OnDestroy {
  // Services
  protected readonly formService: ForgotPasswordFormService = inject(ForgotPasswordFormService);
  protected readonly messageService: MessageService = inject(MessageService);
  private readonly authFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  constructor() {}

  async onForgotPassword(): Promise<void> {
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
    const forgotPasswordData = this.formService.toResponseForCreate();
    try {
      const { resetToken } = await this.authFacadeService.forgotPassword(forgotPasswordData);
      console.log('se pondra el token en la url', resetToken);
      await this.router.navigate(['/videos']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }

  ngOnDestroy(): void {
    this.formService.reset();
  }
}

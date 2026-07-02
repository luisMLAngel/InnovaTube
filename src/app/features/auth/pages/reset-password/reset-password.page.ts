import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormErrorDirective } from '../../../../shared/directives/control-error.directive';
import { PasswordFeedbackComponent } from '../../components/password-feedback/password-feedback.component';
import { AuthFacadeService, ForgotPasswordFormService, ResetPasswordFormService } from '../../services';

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
    PasswordFeedbackComponent,
  ],
  providers: [],
})
export class ResetPasswordPage implements OnInit, OnDestroy {
  protected readonly forgotPasswordFormService = inject(ForgotPasswordFormService);
  protected readonly resetPasswordFormService = inject(ResetPasswordFormService);
  protected readonly messageService = inject(MessageService);
  private readonly authFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  token = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tokenParam = params['token'];
      if (tokenParam) {
        this.token.set(tokenParam);
      }
    });
  }

  async onForgotPassword(): Promise<void> {
    try {
      this.forgotPasswordFormService.validateFormAndThrow();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
      return;
    }
    const forgotPasswordData = this.forgotPasswordFormService.toResponseForCreate();
    try {
      const { resetToken } = await this.authFacadeService.forgotPassword(forgotPasswordData);
      this.token.set(resetToken);
      this.router.navigate([], {
        queryParams: { token: resetToken },
        queryParamsHandling: 'merge',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }

  async onResetPassword(): Promise<void> {
    try {
      this.resetPasswordFormService.validateFormAndThrow();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
      return;
    }

    const currentToken = this.token();
    if (!currentToken) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Token no válido',
      });
      return;
    }

    const resetPasswordData = this.resetPasswordFormService.toResponseForCreate();
    try {
      const response = await this.authFacadeService.resetPassword({
        token: currentToken,
        newPassword: resetPasswordData.password,
      });
      if (response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña restablecida correctamente',
        });
        this.router.navigate(['/auth/login']);
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }

  ngOnDestroy(): void {
    this.forgotPasswordFormService.reset();
    this.resetPasswordFormService.reset();
  }
}

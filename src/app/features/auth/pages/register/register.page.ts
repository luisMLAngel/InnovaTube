import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormErrorDirective } from '../../../../shared/directives/control-error.directive';
import { PasswordFeedbackComponent } from '../../components';
import { AuthFacadeService, RegisterFormService } from '../../services';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxCaptchaModule, ReCaptchaV3Service } from 'ngx-captcha';
import { environment } from '../../../../environments';

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
    RouterLink,
    NgxCaptchaModule,
  ],
  providers: [],
})
export class RegisterPage {
  // Services
  protected readonly messageService: MessageService = inject(MessageService);
  protected readonly formService: RegisterFormService = inject(RegisterFormService);
  private readonly authFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);
  private readonly recaptchaV3Service = inject(ReCaptchaV3Service);

  constructor() {}

  async onRegister(): Promise<void> {
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

    try {
      const token = await this.recaptchaV3Service.executeAsPromise(
        environment.RECAPTCHA_SITE_KEY,
        'register',
      );
      const registerData = { ...this.formService.toResponseForCreate(), recaptchaToken: token };
      await this.authFacadeService.registerUser(registerData);
      await this.router.navigate(['videos']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }
}

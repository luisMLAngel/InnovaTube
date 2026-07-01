import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, InputSignal } from '@angular/core';

export const PASSWORD_RULES: PasswordRuleInterface[] = [
  {
    label: 'Al menos una letra mayúscula',
    regex: /[A-Z]/,
  },
  {
    label: 'Al menos un número',
    regex: /[0-9]/,
  },
  {
    label: 'Al menos 8 caracteres',
    regex: /.{8,}/,
  },
  {
    label: 'Al menos un carácter especial',
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export interface PasswordRuleInterface {
  label: string;
  regex: RegExp;
}

export interface PasswordRuleStatusInterface {
  label: string;
  valid: boolean;
}

@Component({
  selector: 'app-password-feedback',
  template: `
    <div>
      @for (rule of rulesStatus(); track rule.label) {
        <p class="text-xs text-ink-secondary-w transition-all" [class.line-through]="rule.valid">
          {{ rule.label }}
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      p::before {
        content: '•';
        @apply text-ink-secondary-w inline-block mr-2;
      }
    `,
  ],
  imports: [CommonModule],
})
export class PasswordFeedbackComponent {
  password: InputSignal<string | null> = input<string | null>(null);
  rules: InputSignal<PasswordRuleInterface[]> = input<PasswordRuleInterface[]>(PASSWORD_RULES);

  rulesStatus = computed(() => {
    return this.rules().map(rule => ({
      label: rule.label,
      valid: this.password()?.match(rule.regex) ? true : false,
    }));
  });
  constructor() {}
}

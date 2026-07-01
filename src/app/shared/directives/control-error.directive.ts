import {
  ComponentRef,
  Directive,
  effect,
  Injector,
  input,
  Input,
  InputSignal,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Message } from 'primeng/message';
import { Subscription } from 'rxjs';

export const CONTROL_ERRORS: Record<string, (control: AbstractControl) => string> = {
  required: (): string => 'Campo requerido',
  email: (): string => 'Correo electrónico inválido',
  minlength: (control: AbstractControl): string => {
    const requiredLength = control.errors?.['minlength']?.['requiredLength'];
    console.log('errores', control.errors);
    return `Mínimo ${requiredLength} caracteres`;
  },
  maxlength: (control: AbstractControl): string => {
    const requiredLength = control.errors?.['maxlength']?.['requiredLength'];
    return `Máximo ${requiredLength} caracteres`;
  },
  pattern: (): string => 'Formato inválido',
  min: (control: AbstractControl): string => {
    const min = control.errors?.['min']?.['min'];
    return `El valor mínimo es ${min}`;
  },
  max: (control: AbstractControl): string => {
    const max = control.errors?.['max']?.['max'];
    return `El valor máximo es ${max}`;
  },
};

@Directive({
  selector: '[errorMessage]',
  standalone: true,
})
export class FormErrorDirective implements OnInit, OnDestroy {
  showErrors: InputSignal<boolean> = input<boolean>(false);

  private sub?: Subscription;
  private messageRef?: ComponentRef<Message>;

  constructor(
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private injector: Injector,
  ) {
    effect(() => {
      const control = this.ngControl.control;
      if (!control) return;

      this.render(control);
    });
  }

  ngOnInit(): void {
    const control = this.ngControl.control;
    if (!control) return;

    this.sub = control.statusChanges?.subscribe(() => {
      this.render(control);
    });

    this.render(control);
  }

  private render(control: AbstractControl): void {
    if (!this.showErrors || !control.errors || (!control.touched && !control.dirty)) {
      this.destroyMessage();
      return;
    }

    const errorKey = Object.keys(control.errors!)[0];
    const message = CONTROL_ERRORS[errorKey]?.(control) ?? 'Campo inválido';
    if (this.messageRef) {
      this.messageRef.setInput('text', message);
      return;
    }

    this.messageRef = this.vcr.createComponent(Message, {
      injector: this.injector,
    });

    this.messageRef.setInput('severity', 'error');
    this.messageRef.setInput('size', 'small');
    this.messageRef.setInput('variant', 'simple');
    this.messageRef.setInput('text', message);
  }

  private destroyMessage() {
    if (this.messageRef) {
      this.messageRef.destroy();
      this.messageRef = undefined;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.destroyMessage();
  }
}

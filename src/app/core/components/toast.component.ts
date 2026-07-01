import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  template: `
    <p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }">
      <ng-template let-message #headless let-closeFn="closeFn">
        <section
          class="flex flex-col w-full rounded-md shadow-md overflow-hidden bg-w-card"
          [ngClass]="{
            'border-w-success': message.severity === 'success',
            'border-w-danger': message.severity === 'error',
            'border-w-warning': message.severity === 'warn',
            'border-w-info': message.severity === 'info',
            'border-w-primary': !message.severity,
          }"
        >
          <!-- Header con icono y título -->
          <div class="flex items-start gap-3 p-2">
            <!-- Icono según tipo -->
            <div class="flex-shrink-0">
              <i
                class="text-lg"
                [ngClass]="{
                  'pi pi-check-circle text-w-success': message.severity === 'success',
                  'pi pi-times-circle text-w-danger': message.severity === 'error',
                  'pi pi-exclamation-triangle text-w-warning': message.severity === 'warn',
                  'pi pi-info-circle text-w-info': message.severity === 'info',
                  'pi pi-bell text-w-primary': !message.severity,
                }"
              ></i>
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-w-prim text-sm mb-1">
                {{ message.summary }}
              </h3>
              <p *ngIf="message.detail" class="text-ink-secondary-w text-xs leading-relaxed">
                {{ message.detail }}
              </p>
            </div>

            <!-- Botón cerrar -->
            <button
              type="button"
              (click)="closeFn($event)"
              class="flex-shrink-0 w-6 h-6 rounded hover:bg-w-hover transition-colors duration-200 flex items-center justify-center text-w-muted hover:text-w-prim"
              aria-label="Cerrar"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Barra de progreso (opcional) -->
          @if (message.life) {
            <div
              class="h-1 overflow-hidden"
              [ngClass]="{
                'bg-w-success/20': message.severity === 'success',
                'bg-w-danger/20': message.severity === 'error',
                'bg-w-warning/20': message.severity === 'warn',
                'bg-w-info/20': message.severity === 'info',
                'bg-w-primary/20': !message.severity,
              }"
            >
              <div
                class="toast-progress h-full w-full"
                [ngClass]="{
                  'bg-w-success': message.severity === 'success',
                  'bg-w-danger': message.severity === 'error',
                  'bg-w-warning': message.severity === 'warn',
                  'bg-w-info': message.severity === 'info',
                  'bg-w-primary': !message.severity,
                }"
                [style.animation-duration.ms]="message.life"
              ></div>
            </div>
          }
        </section>
      </ng-template>
    </p-toast>
  `,
  styles: [
    `
      @keyframes shrink {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }

      .toast-progress {
        animation: shrink linear forwards;
        transform-origin: left;
      }
    `,
  ],
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
})
export class ToastComponent {}

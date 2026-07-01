import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class HttpErrorFacadeService {
  protected readonly messageService: MessageService = inject(MessageService);

  handle(error: HttpErrorResponse) {
    const message = error.message ?? 'Ocurrió un error desconocido';
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  }
}

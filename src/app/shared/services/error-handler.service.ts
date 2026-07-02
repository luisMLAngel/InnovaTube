import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SERVER_ERROR_MESSAGES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  createRequestException(httpErrorResponse: HttpErrorResponse): Error {
    console.log('error en handler', httpErrorResponse);
    if (!navigator.onLine) return new Error('¡Sin Internet! Verifica tu conexión.');

    const message: string = (httpErrorResponse?.error?.message ?? '').toString().trim();
    const status: number = httpErrorResponse?.status ?? -1;
    const code = message.split(' - ')[0];

    if (message && code in SERVER_ERROR_MESSAGES) {
      return new Error(SERVER_ERROR_MESSAGES[code]);
    }
    return new Error('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
  }
}

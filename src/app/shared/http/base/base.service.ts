import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Observer, of, RetryConfig } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PrismaCountFilter, PrismaFilter } from './interfaces/prisma-filter.interface';
import { isNil, isObject, omit, omitBy } from 'lodash';
import { HttpOptions } from './interfaces/http-options.interface';
import { RemoveArray } from './types';
import { DataBaseServiceResponse } from './interfaces/data-base-service-response.interface';
import { RETRY_STRATEGY_CONST } from './const/retry-strategy.const';
import { DownloadUtilClass } from './class';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private httpClient: HttpClient) {}

  private stringifyFilters<T>(filter?: PrismaFilter<T>, params?: any): any {
    const stringifyFilters: any = {};

    if (filter) {
      for (const [key, value] of Object.entries(filter ?? {})) {
        stringifyFilters[key] = isObject(value) ? JSON.stringify(value) : value;
      }
    }

    if (params) {
      for (const [key, value] of Object.entries(params ?? {})) {
        stringifyFilters[key] = isObject(value) ? JSON.stringify(value) : value;
      }
    }

    return stringifyFilters;
  }

  private buildHttpOptions<T>(
    httpOptions?: Omit<HttpOptions, 'observe'>,
    filters?: PrismaFilter<RemoveArray<T>>,
    authorization?: string,
  ): HttpOptions {
    const options: HttpOptions = httpOptions ?? {};

    // Filters
    options.params = this.stringifyFilters<RemoveArray<T>>(
      omitBy(filters, isNil),
      omitBy(httpOptions?.params ?? {}, isNil),
    );

    // Observe
    options.observe = 'body';

    // Authorization
    if (authorization !== void 0 && authorization.length > 0) {
      options.headers = new HttpHeaders({
        ...(httpOptions?.headers ?? {}),
        'Content-Type': 'application/json',
        Authorization: authorization,
      });
    }
    return options;
  }

  private responseStructure<T>(response: T | HttpErrorResponse): DataBaseServiceResponse<T> {
    // Custom errors
    if (response instanceof Error) {
      return {
        error: true,
        code: 400,
        message: response.message,
        entity: null,
        serverResponse: response,
      };
    }

    // Server errors
    if (response instanceof TypeError) {
      return {
        error: true,
        code: 500,
        message: response.message,
        entity: null,
        serverResponse: response,
      };
    }

    if (response instanceof HttpErrorResponse) {
      return {
        error: true,
        code: response.status,
        message: response.error.message ?? response.error,
        entity: null,
        serverResponse: response,
      };
    }

    return {
      error: false,
      code: 200,
      message: 'ok',
      serverResponse: response,
      entity: response,
    };
  }

  get<T>(
    path: string,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<T>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<T>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);

      this.httpClient
        .get(path, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe(async (response: T | HttpErrorResponse): Promise<void> => {
          observer.next(this.responseStructure<T>(response));
          observer.complete();
        });
    });
  }

  download(
    path: string,
    fileName?: { name: string; extension: string },
    mimeType: string = 'application/octet-stream',
    authorization?: string,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<Blob>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<Blob | any>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, {}, authorization);
      this.httpClient
        .get(path, {
          ...options,
          observe: 'response',
          responseType: 'blob',
          headers: new HttpHeaders({
            Authorization: `Bearer ${authorization}`,
            'Content-Type': mimeType,
            Accept: mimeType,
          }),
        })
        .pipe(
          retry(retryStrategy),
          catchError((error: any) => of(error)),
        )
        .subscribe(async (response: HttpResponse<Blob> | HttpErrorResponse): Promise<void> => {
          const contentDisposition: string | null = response.headers.get('Content-Disposition');
          if (response instanceof HttpErrorResponse) {
            observer.next(this.responseStructure(response));
          } else {
            DownloadUtilClass.downloadWithContentDisposition(
              response.body!,
              fileName
                ? `attachment; filename="${fileName.name}.${fileName.extension}"`
                : contentDisposition!,
            );
            observer.next(this.responseStructure(response));
          }

          observer.complete();
        });
    });
  }

  count<T>(
    path: string,
    filters?: PrismaCountFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<number>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<number>>): void => {
      const options: HttpOptions = this.buildHttpOptions(
        httpOptions,
        omit(filters, ['take', 'skip', 'include']),
        authorization,
      );

      this.httpClient
        .get(path, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe(async (response: number | HttpErrorResponse): Promise<void> => {
          observer.next(this.responseStructure<number>(response));
          observer.complete();
        });
    });
  }

  postv2<T>(
    path: string,
    entity: any,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<T> {
    const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);
    return this.httpClient.post<T>(path, entity, options).pipe(retry(retryStrategy));
  }

  getv2<T>(
    path: string,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<T> {
    const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);
    return this.httpClient.get<T>(path, options).pipe(retry(retryStrategy));
  }

  post<T>(
    path: string,
    entity: any,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<T>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<T>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);

      this.httpClient
        .post(path, entity, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe(async (response: T | HttpErrorResponse): Promise<void> => {
          observer.next(this.responseStructure(response));
          observer.complete();
        });
    });
  }

  put<T>(
    path: string,
    entity: any,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<T>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<T>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);

      this.httpClient
        .put(path, entity, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe((response: T | HttpErrorResponse) => {
          observer.next(this.responseStructure(response));
          observer.complete();
        });
    });
  }

  patch<T>(
    path: string,
    entity: any,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<T>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<T>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);

      this.httpClient
        .patch(path, entity, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe((response: T | HttpErrorResponse): void => {
          observer.next(this.responseStructure(response));
          observer.complete();
        });
    });
  }

  delete<T>(
    path: string,
    filters?: PrismaFilter<RemoveArray<T>>,
    httpOptions?: Omit<HttpOptions, 'observe'>,
    authorization?: string,
    retryStrategy: RetryConfig = RETRY_STRATEGY_CONST,
  ): Observable<DataBaseServiceResponse<T>> {
    return new Observable((observer: Observer<DataBaseServiceResponse<T>>): void => {
      const options: HttpOptions = this.buildHttpOptions(httpOptions, filters, authorization);

      this.httpClient
        .delete(path, options)
        .pipe(
          retry(retryStrategy),
          catchError(error => of(error)),
        )
        .subscribe((response): void => {
          observer.next(this.responseStructure(response));
          observer.complete();
        });
    });
  }
}

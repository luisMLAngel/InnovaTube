import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments';
import { BaseService } from '../../../shared/http/base/base.service';
import { DataBaseServiceResponse } from '../../../shared/http/base/interfaces/data-base-service-response.interface';
import { ErrorHandlerService } from '../../../shared/services';
import {
  AuthForgotPasswordInterface,
  AuthResponseInterface,
  CreateUserDto,
  UserCredentialsInterface,
} from '../interfaces';
import { LoginResponse, RegisterResponse } from '../forms';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SERVER: string = environment.SERVER;

  constructor(
    private readonly baseService: BaseService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async login(credentials: LoginResponse): Promise<AuthResponseInterface | null> {
    const response: DataBaseServiceResponse<AuthResponseInterface> = await firstValueFrom(
      this.baseService.post<AuthResponseInterface>(
        `${this.SERVER}/auth/login`,
        credentials,
        void 0,
        { withCredentials: true },
      ),
    );
    if (response.error) {
      throw new Error(response.message);
    }
    return response.entity ?? null;
  }

  async registerUser(data: RegisterResponse): Promise<AuthResponseInterface | null> {
    const response: DataBaseServiceResponse<AuthResponseInterface> = await firstValueFrom(
      this.baseService.post<AuthResponseInterface>(`${this.SERVER}/auth/register`, data, void 0),
    );
    if (response.error) {
      throw new Error(response.message);
    }
    return response.entity ?? null;
  }

  async refreshToken(): Promise<string | null> {
    const response: DataBaseServiceResponse<AuthResponseInterface> = await firstValueFrom(
      this.baseService.post<AuthResponseInterface>(
        `${this.SERVER}/auth/refresh-token`,
        void 0,
        void 0,
        { withCredentials: true },
      ),
    );
    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }
    return response.entity?.accessToken || null;
  }

  async forgotPassword(email: string): Promise<AuthForgotPasswordInterface> {
    const response: DataBaseServiceResponse<AuthForgotPasswordInterface> = await firstValueFrom(
      this.baseService.post<AuthForgotPasswordInterface>(
        `${this.SERVER}/auth/forgot-password`,
        { email },
        void 0,
        { withCredentials: true },
      ),
    );
    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }
    return response.entity!;
  }
}

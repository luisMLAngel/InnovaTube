import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments';
import { BaseService } from '../../../shared/http/base/base.service';
import { DataBaseServiceResponse } from '../../../shared/http/base/interfaces/data-base-service-response.interface';
import { ErrorHandlerService } from '../../../shared/services';
import {
  AuthMeInterface,
  AuthResponseInterface,
  CreateUserDto,
  UserCredentialsInterface,
} from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SERVER: string = environment.SERVER;
  accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly baseService: BaseService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async login(credentials: UserCredentialsInterface): Promise<string | null> {
    const response: AuthResponseInterface = await firstValueFrom(
      this.baseService.postv2<AuthResponseInterface>(
        `${this.SERVER}/auth/login`,
        credentials,
        void 0,
        { withCredentials: true },
      ),
    );
    return response.accessToken;
  }

  async selectOrganization(organizationId: string): Promise<AuthMeInterface> {
    const response: AuthMeInterface = await firstValueFrom(
      this.baseService.postv2(`${this.SERVER}/auth/select-organization`, { organizationId }),
    );
    return response;
  }

  async registerUser(data: CreateUserDto): Promise<string | null> {
    const response: AuthResponseInterface = await firstValueFrom(
      this.baseService.postv2<AuthResponseInterface>(`${this.SERVER}/auth/register`, data, void 0),
    );
    return response.accessToken;
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

  setAccessToken(token: string | null): void {
    this.accessTokenSubject.next(token);
  }
}

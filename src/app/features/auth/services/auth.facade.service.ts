import { inject, Injectable } from '@angular/core';
import {
  AuthForgotPasswordInterface,
  AuthResponseInterface,
  CreateUserDto,
  ResetPasswordRequestInterface,
  ResetPasswordResponseInterface,
  UserCredentialsInterface,
} from '../interfaces';
import { AuthRepository } from '../states';
import { AuthService } from './auth.service';
import { StorageService } from '../../../core/services';
import { UserRepository } from '../../user/states';
import { ForgotPasswordResponse, LoginResponse, RegisterResponse } from '../forms';
@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthRepository);
  private readonly userState = inject(UserRepository);
  private readonly storageService = inject(StorageService);

  user = this.authState.user;
  constructor() {}

  async login(credentials: LoginResponse): Promise<void> {
    const response: AuthResponseInterface | null = await this.authService.login(credentials);
    this.setAccessToken(response?.accessToken || null);
    this.setRefreshToken(response?.refreshToken || null);
    this.userState.setUser(response?.user || null);
  }

  async registerUser(data: RegisterResponse): Promise<void> {
    console.log('REGISTER DATA', data);
    const response: AuthResponseInterface | null = await this.authService.registerUser(data);
    this.setAccessToken(response?.accessToken || null);
    this.setRefreshToken(response?.refreshToken || null);
    this.userState.setUser(response?.user || null);
  }

  async refreshToken(): Promise<void> {
    const accessToken: string | null = await this.authService.refreshToken();
    this.setAccessToken(accessToken);
  }

  async forgotPassword(data: ForgotPasswordResponse): Promise<AuthForgotPasswordInterface> {
    const { email } = data;
    return await this.authService.forgotPassword(email);
  }

  async resetPassword(data: ResetPasswordRequestInterface): Promise<ResetPasswordResponseInterface> {
    return await this.authService.resetPassword(data);
  }

  async logout(): Promise<void> {
    // limpiaras localstorage y va a matar la sesion en el backend
    this.setAccessToken(null);
    this.setRefreshToken(null);
    this.userState.setUser(null);
  }

  setAccessToken(token: string | null): void {
    this.storageService.setAccessToken(token);
  }

  setRefreshToken(token: string | null): void {
    this.storageService.setRefreshToken(token);
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getAccessToken();
  }

  getAccessToken(): string | null {
    return this.storageService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.storageService.getRefreshToken();
  }
}

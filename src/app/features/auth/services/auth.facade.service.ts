import { inject, Injectable } from '@angular/core';
import { AuthResponseInterface, CreateUserDto, UserCredentialsInterface } from '../interfaces';
import { AuthRepository } from '../states';
import { AuthService } from './auth.service';
import { StorageService } from '../../../core/services';
import { UserRepository } from '../../user/states';
@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthRepository);
  private readonly userState = inject(UserRepository);
  private readonly storageService = inject(StorageService);

  user = this.authState.user;
  constructor() {}

  async login(credentials: UserCredentialsInterface): Promise<void> {
    const response: AuthResponseInterface | null = await this.authService.login(credentials);
    this.setAccessToken(response?.accessToken || null);
    this.setRefreshToken(response?.refreshToken || null);
    this.userState.setUser(response?.user || null);
  }

  async registerUser(data: CreateUserDto): Promise<void> {
    const accessToken: string | null = await this.authService.registerUser(data);
    this.setAccessToken(accessToken);
  }

  async refreshToken(): Promise<void> {
    const accessToken: string | null = await this.authService.refreshToken();
    this.setAccessToken(accessToken);
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

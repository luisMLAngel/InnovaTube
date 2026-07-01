import { inject, Injectable } from '@angular/core';
import { AuthMeInterface, CreateUserDto, UserCredentialsInterface } from '../interfaces';
import { AuthRepository } from '../states';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthRepository);

  user = this.authState.user; // Signal<UserInterface | null>
  organization = this.authState.organization; // Signal<OrganizationInterface | null>
  constructor() {}

  async login(credentials: UserCredentialsInterface): Promise<void> {
    const accessToken: string | null = await this.authService.login(credentials);
    this.setAccessToken(accessToken);
  }

  async selectOrganization(organizationId: string): Promise<void> {
    const { accessToken, user, organization }: AuthMeInterface =
      await this.authService.selectOrganization(organizationId);
    this.setAccessToken(accessToken);
    this.authState.setUser(user);
    this.authState.setOrganization(organization);
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
  }

  setAccessToken(token: string | null): void {
    this.authService.accessTokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    return !!this.authService.accessTokenSubject.value;
  }

  getAccessToken(): string | null {
    return this.authService.accessTokenSubject.value;
  }
}

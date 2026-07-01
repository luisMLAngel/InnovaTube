import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrganizationInterface, UserInterface } from '../../../core/interfaces';
import { UserRepository } from '../states';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  user: Signal<UserInterface | null>;
  organization: Signal<OrganizationInterface | null>;
  constructor(
    private readonly userService: UserService,
    private readonly userState: UserRepository,
  ) {
    this.user = toSignal(this.userState.user$, { initialValue: null });
    this.organization = toSignal(this.userState.organization$, { initialValue: null });
  }

  async me(): Promise<void> {
    const { user, organization } = await this.userService.me();
    this.userState.setUser(user);
    this.userState.setOrganization(organization);
  }
}

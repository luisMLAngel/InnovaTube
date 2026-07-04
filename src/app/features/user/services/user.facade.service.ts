import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrganizationInterface, UserInterface } from '../../../core/interfaces';
import { UserRepository } from '../states';
import { UserService } from './user.service';
import { MESSAGES } from '../../../core/constants';

@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  user: Signal<UserInterface | null>;
  constructor(
    private readonly userService: UserService,
    private readonly userState: UserRepository,
  ) {
    this.user = toSignal(this.userState.user$, { initialValue: null });
  }

  async me(): Promise<void> {
    const data = await this.userService.me();
    this.userState.setUser(data);
    if (!data) {
      throw new Error(MESSAGES.AUTH.MISSING_ACCESS_TOKEN);
    }
  }
}

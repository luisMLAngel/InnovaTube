import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { OrganizationInterface, UserInterface } from '../../../core/interfaces';
import { Injectable } from '@angular/core';

export interface UserState {
  user: UserInterface | null;
  organization: OrganizationInterface | null;
}

export const userState = createStore(
  { name: 'user' },
  withProps<UserState>({ user: null, organization: null }),
);

@Injectable({ providedIn: 'root' })
export class UserRepository {
  readonly user$ = userState.pipe(select(state => state.user));
  readonly organization$ = userState.pipe(select(state => state.organization));

  setUser(user: UserInterface | null): void {
    userState.update(setProp('user', user));
  }

  setOrganization(organization: OrganizationInterface | null): void {
    userState.update(setProp('organization', organization));
  }
}

import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { OrganizationInterface, UserInterface } from '../../../core/interfaces';
import { Injectable } from '@angular/core';

export interface UserState {
  user: UserInterface | null;
}

export const userState = createStore({ name: 'user' }, withProps<UserState>({ user: null }));

@Injectable({ providedIn: 'root' })
export class UserRepository {
  readonly user$ = userState.pipe(select(state => state.user));

  constructor() {}

  setUser(user: UserInterface | null): void {
    userState.update(setProp('user', user));
  }
}

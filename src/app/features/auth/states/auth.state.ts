import { Injectable, Signal } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { OrganizationInterface, UserInterface } from '../../../core/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';

export interface AuthState {
  status: 'authenticated' | 'unauthenticated' | 'checking';
  user: UserInterface | null;
  organization: OrganizationInterface | null;
}

export const authState = createStore(
  { name: 'auth' },
  withProps<AuthState>({ status: 'unauthenticated', user: null, organization: null }),
);

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  readonly user: Signal<UserInterface | null>;

  constructor() {
    this.user = toSignal(authState.pipe(select(state => state.user)), { initialValue: null });
  }

  setUser(user: any): void {
    console.log('AuthRepository -> setUser -> user', user);
    authState.update(state => ({ ...state, user }));
  }
}

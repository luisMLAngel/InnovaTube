import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';
import { StorageKeys, StorageService } from './storage.service';

export type SidebarPreference = 'collapse' | 'expand' | null;

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly SIDEBAR_QUERY = '(max-width: 1240px)';
  readonly sidebarLayoutState = signal(true); // true = expanded, false = collapsed
  readonly sidebarPreference = signal<SidebarPreference>(null);
  // Services
  private readonly storageService = inject(StorageService);

  constructor(private breakpoint: BreakpointObserver) {
    this.breakpoint.observe([this.SIDEBAR_QUERY]).subscribe(result => {
      const sidebarPref = this.storageService.get<'collapse' | 'expand'>(
        StorageKeys.SIDEBAR_PREFERENCE,
      );
      this.sidebarPreference.set(sidebarPref);
      // 1.- Si es breackpoint de colapsar y la preferencia es expandir, entonces se colapsa
      // 2.- Si es breakpoint de colapsar y no hay preferencia, entonces se colapsa
      // 3.- Si es breakpoint de expandir y la preferencia es expandir, entonces se expande
      // 4.- Si es breakpoint de expandir y la preferencia es colapsar, entonces se colapsa
      if (result.matches && sidebarPref === 'expand') {
        // 1
        // se colapsa
        this.sidebarLayoutState.set(false);
      } else if (result.matches && !sidebarPref) {
        // 2
        // se colapsa
        this.sidebarLayoutState.set(false);
      } else if (!result.matches && sidebarPref === 'expand') {
        // se expande
        this.sidebarLayoutState.set(true);
      } else if (!result.matches && sidebarPref === 'collapse') {
        // se colapsa
        this.sidebarLayoutState.set(false);
      }
    });
  }

  /**
   * Alterna el estado del sidebar y guarda la preferencia del usuario
   */
  toggleSidebar(): void {
    const newState = !this.sidebarLayoutState();
    this.sidebarLayoutState.set(newState);

    // Guardar la preferencia del usuario
    const preference: SidebarPreference = newState ? 'expand' : 'collapse';
    this.sidebarPreference.set(preference);
    this.storageService.set(StorageKeys.SIDEBAR_PREFERENCE, preference);
  }

  /**
   * Establece el estado del sidebar manualmente
   */
  setSidebarState(expanded: boolean): void {
    this.sidebarLayoutState.set(expanded);
    const preference: SidebarPreference = expanded ? 'expand' : 'collapse';
    this.sidebarPreference.set(preference);
    this.storageService.set(StorageKeys.SIDEBAR_PREFERENCE, preference);
  }
}

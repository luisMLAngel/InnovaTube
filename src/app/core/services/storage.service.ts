import { Injectable } from '@angular/core';

export enum StorageKeys {
  SIDEBAR_PREFERENCE = 'SIDEBAR_PREFERENCE',
  APP_THEME_PREFERENCE = 'APP_THEME_PREFERENCE',
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }
}

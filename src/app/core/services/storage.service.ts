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

  setAccessToken(token: string | null): void {
    if (token) {
      this.set('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  getAccessToken(): string | null {
    return this.get<string>('ACCESS_TOKEN');
  }

  setRefreshToken(token: string | null): void {
    if (token) {
      this.set('REFRESH_TOKEN', token);
    } else {
      localStorage.removeItem('REFRESH_TOKEN');
    }
  }

  getRefreshToken(): string | null {
    return this.get<string>('REFRESH_TOKEN');
  }

  clear(): void {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
  }
}

import { Injectable, signal, effect } from '@angular/core';

/**
 * ════════════════════════════════════════════════════════════════
 * THEME SERVICE
 * ════════════════════════════════════════════════════════════════
 *
 * Servicio para gestionar el tema de la aplicación (light/dark/system)
 * - Persiste la preferencia del usuario en localStorage
 * - Detecta automáticamente el tema del sistema
 * - Aplica el tema al DOM actualizando el atributo data-theme
 */

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'innovatube-theme-preference';

  /**
   * Tema seleccionado por el usuario (light, dark o system)
   */
  readonly theme = signal<Theme>(this.getInitialTheme());

  /**
   * Tema efectivo aplicado (light o dark, sin 'system')
   */
  readonly effectiveTheme = signal<'light' | 'dark'>(this.getEffectiveTheme());

  /**
   * MediaQuery para detectar preferencia del sistema
   */
  private darkModeMediaQuery: MediaQueryList | null = null;

  constructor() {
    // Inicializar detección del tema del sistema
    if (typeof window !== 'undefined') {
      this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkModeMediaQuery.addEventListener('change', () => this.updateEffectiveTheme());
    }

    // Effect: Aplicar tema cuando cambie
    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });

    // Effect: Persistir preferencia cuando cambie
    effect(() => {
      const currentTheme = this.theme();
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      }
      this.updateEffectiveTheme();
    });
  }

  /**
   * Cambiar el tema de la aplicación
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /**
   * Toggle entre light y dark (ignora system)
   */
  toggleTheme(): void {
    const current = this.effectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  // ════════════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS
  // ════════════════════════════════════════════════════════════════

  /**
   * Obtener tema inicial desde localStorage o sistema
   */
  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    return stored || 'system';
  }

  /**
   * Calcular el tema efectivo (resolver 'system' a 'light' o 'dark')
   */
  private getEffectiveTheme(): 'light' | 'dark' {
    const currentTheme = this.theme();

    if (currentTheme === 'system') {
      return this.getSystemTheme();
    }

    return currentTheme;
  }

  /**
   * Detectar tema del sistema
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Actualizar tema efectivo cuando cambie el tema seleccionado o el sistema
   */
  private updateEffectiveTheme(): void {
    this.effectiveTheme.set(this.getEffectiveTheme());
  }

  /**
   * Aplicar tema al DOM
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Cambio instantáneo sin transiciones (mejor rendimiento)
    // La clase se mantiene por compatibilidad pero no aplica transiciones
    root.classList.add('theme-transition');
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 0);
  }
}

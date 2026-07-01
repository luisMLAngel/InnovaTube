import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerChevronUp,
  tablerHelpHexagon,
  tablerLogout2,
  tablerSettings,
} from '@ng-icons/tabler-icons';
import { PopoverModule } from 'primeng/popover';
import { Divider } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ThemeService, type Theme } from '../../services/theme.service';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-user-profile-section',
  template: `
    <div
      class="group bg-selected-w p-2 rounded-md border border-stroke-w flex flex-col gap-2 overflow-hidden"
    >
      <div class="flex items-center gap-2">
        @if (userAvatarUrl()) {
          <div class="aspect-square overflow-hidden w-8 h-8 rounded-sm bg-theme-w p-1">
            <img [src]="userAvatarUrl()" class="w-full h-full object-cover rounded" />
          </div>
        } @else {
          <p-avatar [label]="userInitial()" />
        }

        <p class="text-ink-secondary-w font-medium text-base">{{ userName() }}</p>
        <div
          class="flex -space-x-1 ml-auto w-8 h-8 justify-center items-center rounded-full transition-colors hover:bg-theme-w cursor-pointer"
          (click)="op.toggle($event)"
        >
          <ng-icon name="tablerChevronUp" class="!text-ink-primary-w text-lg"></ng-icon>
        </div>
      </div>
    </div>

    <p-popover #op>
      <ng-template #content>
        <div class="min-w-[250px]">
          <div>
            <div
              class="flex items-center gap-2 cursor-pointer hover:bg-selected-w transition-colors p-2 mb-0 mt-2 mx-2 rounded"
            >
              <ng-icon name="tablerSettings" class="!text-ink-primary-w text-lg"></ng-icon>
              <p class="text-ink-primary-w text-base">Configuración</p>
            </div>
            <div
              class="flex items-center gap-2 cursor-pointer hover:bg-selected-w transition-colors p-2 my-0 mx-2 rounded"
            >
              <ng-icon name="tablerHelpHexagon" class="!text-ink-primary-w text-lg"></ng-icon>
              <p class="text-ink-primary-w text-base">Ayuda</p>
            </div>
          </div>

          <p-divider class="my-2" />

          <div class="px-2">
            <p-selectbutton
              [(ngModel)]="selectedTheme"
              [options]="themeOptions"
              (ngModelChange)="onThemeChange($event)"
              optionLabel="label"
              optionValue="value"
              size="small"
              fluid
            />
          </div>

          <p-divider class="my-2" />

          <div>
            <div
              class="flex items-center gap-2 cursor-pointer hover:bg-selected-w transition-colors p-2 mb-2 mx-2 rounded"
            >
              <ng-icon name="tablerLogout2" class="!text-error-w text-lg"></ng-icon>
              <p class="text-ink-primary-w text-base">Cerrar sesión</p>
            </div>
          </div>
        </div>
      </ng-template>
    </p-popover>
  `,
  standalone: true,
  imports: [CommonModule, NgIcon, PopoverModule, Divider, SelectButtonModule, FormsModule, Avatar],
  providers: [provideIcons({ tablerLogout2, tablerChevronUp, tablerSettings, tablerHelpHexagon })],
})
export class UserProfileSectionComponent {
  private readonly themeService = inject(ThemeService);

  userName: InputSignal<string> = input<string>('No definido');
  userAvatarUrl: InputSignal<string> = input<string>('');

  userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });

  /**
   * Tema seleccionado actualmente
   */
  protected selectedTheme = this.themeService.theme();

  /**
   * Opciones para el selector de tema
   */
  protected themeOptions = [
    { label: 'Claro', value: 'light' as Theme },
    { label: 'Oscuro', value: 'dark' as Theme },
    { label: 'Sistema', value: 'system' as Theme },
  ];

  /**
   * Maneja el cambio de tema
   */
  protected onThemeChange(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}

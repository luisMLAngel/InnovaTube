import { Component, input, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronRight } from '@ng-icons/tabler-icons';

export interface UserOrganizationCardData {
  id: string;
  name: string;
  logoUrl?: string;
  lastAccessedAt?: Date | string | null;
}

@Component({
  selector: 'app-user-organization-card',
  standalone: true,
  template: `
    <div
      tabindex="0"
      role="button"
      aria-label="Seleccionar organización"
      class="group flex items-center gap-4 rounded-xl border border-transparent bg-panel-w px-4 py-3 shadow-sm transition-colors
          hover:border-primary-w"
      [class.border-purple-500]="selected()"
      [class.bg-purple-500/10]="selected()"
    >
      @if (organization().logoUrl) {
        <div
          class="flex justify-center items-center aspect-square overflow-hidden w-10 h-10 rounded-sm bg-theme-w p-1"
        >
          <img [src]="organization().logoUrl!" [alt]="organization().name" class="object-cover" />
        </div>
      } @else {
        <div class="flex justify-center items-center w-10 h-10 rounded-sm bg-theme-w p-1">
          <span class="uppercase text-xl text-ink-primary">{{
            organization().name.charAt(0)
          }}</span>
        </div>
      }

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-ink-primary-w">
          {{ organization().name }}
        </p>
        <p class="mt-0.5 text-xs text-ink-secondary-w">Último acceso · {{ lastAccessedLabel() }}</p>
      </div>

      <ng-icon
        name="tablerChevronRight"
        class="text-xs text-ink-muted-w transition-transform group-hover:translate-x-0.5"
      />
    </div>
  `,
  imports: [NgIcon],
  providers: [provideIcons({ tablerChevronRight })],
})
export class UserOrganizationCardComponent {
  organization = input.required<UserOrganizationCardData>();
  selected = input<boolean>(false);

  lastAccessedLabel = computed(() => {
    const value = this.organization().lastAccessedAt;
    if (!value) return 'Nunca accedido';
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });
}

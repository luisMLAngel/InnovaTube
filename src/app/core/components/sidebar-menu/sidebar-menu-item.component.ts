import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerStar, tablerPhotoVideo } from '@ng-icons/tabler-icons';

export interface SidebarMenuItem {
  label: string;
  route: string;
  icon?: string;
  isExternal?: boolean;
  keyboardShortcut?: string;
  action?: () => void;
  disabled?: boolean;
  permissions?: string[];
  dataId?: string; // este valor se debe concordar con el data de una ruta especifica para enlazarlas
  /**
   *
   * o/clients {data: configuration.}
   *
   */
}

@Component({
  selector: 'app-sidebar-menu-item',
  template: `
    <li class="flex">
      @if (!item().isExternal && !item().action) {
        <a
          [routerLink]="item().route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="menu-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 cursor-pointer border border-transparent hover:bg-selected-w hover:border-stroke-w group w-full"
          [class.collapsed]="isCollapsed()"
          [class.disabled]="item().disabled"
        >
          <!-- Icon or Initial Letter -->
          <span class="icon-container flex items-center justify-center w-5 h-5 flex-shrink-0">
            @if (item().icon) {
              <ng-icon [name]="item().icon" class="text-base !text-ink-secondary-w"></ng-icon>
            } @else {
              <span class="text-sm text-ink-secondary-w">{{ getInitial() }}</span>
            }
          </span>

          <!-- Label and Shortcut -->
          <span
            class="label-container flex items-center justify-between flex-1 overflow-hidden transition-all duration-300"
            [class.opacity-0]="isCollapsed()"
            [class.w-0]="isCollapsed()"
          >
            <span class="text-sm text-ink-secondary-w whitespace-nowrap">{{ item().label }}</span>
            @if (item().keyboardShortcut) {
              <span
                class="keyboard-shortcut text-xs rounded bg-surface-secondary-w text-ink-muted-w tracking-[2px]"
              >
                {{ item().keyboardShortcut }}
              </span>
            }
          </span>
        </a>
      } @else if (item().action) {
        <button
          (click)="handleAction($event)"
          class="menu-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 cursor-pointer border border-transparent hover:bg-selected-w hover:border-stroke-w group w-full"
          [class.collapsed]="isCollapsed()"
          [class.disabled]="item().disabled"
        >
          <!-- Icon or Initial Letter -->
          <span class="icon-container flex items-center justify-center w-5 h-5 flex-shrink-0">
            @if (item().icon) {
              <ng-icon [name]="item().icon" class="text-base !text-ink-secondary-w"></ng-icon>
            } @else {
              <span class="text-sm text-ink-secondary-w">{{ getInitial() }}</span>
            }
          </span>

          <!-- Label and Shortcut -->
          <span
            class="label-container flex items-center justify-between flex-1 overflow-hidden transition-all duration-300"
            [class.opacity-0]="isCollapsed()"
            [class.w-0]="isCollapsed()"
          >
            <span class="text-base text-ink-secondary-w whitespace-nowrap">{{ item().label }}</span>
            @if (item().keyboardShortcut) {
              <span
                class="keyboard-shortcut text-xs rounded bg-surface-secondary-w text-ink-muted-w tracking-[2px]"
              >
                {{ item().keyboardShortcut }}
              </span>
            }
          </span>
        </button>
      } @else {
        <a
          [href]="item().route"
          target="_blank"
          rel="noopener noreferrer"
          class="menu-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 cursor-pointer hover:bg-selected-w group w-full"
          [class.collapsed]="isCollapsed()"
        >
          <!-- Icon or Initial Letter -->
          <span class="icon-container flex items-center justify-center w-5 h-5 flex-shrink-0">
            @if (item().icon) {
              <ng-icon [name]="item().icon" class="text-base"></ng-icon>
            } @else {
              <span class="font-medium text-sm">{{ getInitial() }}</span>
            }
          </span>

          <!-- Label and Shortcut -->
          <span
            class="label-container flex items-center justify-between flex-1 overflow-hidden transition-all duration-300"
            [class.opacity-0]="isCollapsed()"
            [class.w-0]="isCollapsed()"
          >
            <span class="text-sm font-medium whitespace-nowrap">{{ item().label }}</span>
            @if (item().keyboardShortcut) {
              <span
                class="keyboard-shortcut text-xs rounded bg-surface-secondary-w text-ink-muted-w tracking-[2px]"
              >
                {{ item().keyboardShortcut }}
              </span>
            }
          </span>
        </a>
      }
    </li>
  `,
  styles: [
    `
      .menu-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .menu-item.collapsed {
        width: fit-content;
      }

      .menu-item:not(.collapsed) {
        width: 100%;
      }

      .menu-item.active {
        @apply bg-selected-w border-stroke-w;
      }

      .menu-item.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .label-container {
        transition:
          opacity 0.3s ease,
          width 0.3s ease;
      }

      .collapsed .label-container {
        opacity: 0;
        width: 0;
      }
    `,
  ],
  imports: [CommonModule, NgIcon, RouterLink, RouterLinkActive],
  providers: [
    provideIcons({
      tablerStar,
      tablerPhotoVideo,
    }),
  ],
})
export class SidebarMenuItemComponent {
  item = input.required<SidebarMenuItem>();
  isCollapsed = input<boolean>(false);

  getInitial = computed(() => {
    return this.item().label.charAt(0).toUpperCase();
  });

  handleAction(event: Event): void {
    event.preventDefault();
    if (this.item().action && !this.item().disabled) {
      this.item().action!();
    }
  }
}

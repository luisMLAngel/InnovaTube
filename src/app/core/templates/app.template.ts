import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerNote } from '@ng-icons/tabler-icons';
import { Divider } from 'primeng/divider';
import { AuthFacadeService } from '../../features/auth/services';
import { SidebarMenuComponent } from '../components';
import { LayoutService } from '../services';
import { UserFacadeService } from '../../features/user/services';

@Component({
  selector: 'app-app-template',
  template: `
    <div class="app-shell">
      <div class="app-layout">
        <!-- Sidebar Panel -->
        <aside
          class="app-sidebar transition-all duration-300"
          [class.collapsed]="!layoutService.sidebarLayoutState()"
          [class.expanded]="layoutService.sidebarLayoutState()"
        >
          <app-sidebar-menu [user]="userFacadeService.user()"></app-sidebar-menu>
        </aside>

        @if (!layoutService.sidebarLayoutState()) {
          <div
            class="sidebar-collapsed-indicator"
            (click)="layoutService.toggleSidebar()"
            title="Expandir menú"
          >
            <div class="indicator-line"></div>
          </div>
        }

        <main class="app-main-wrapper">
          <div class="app-page-container">
            <router-outlet></router-outlet>
          </div>

          <footer class="app-footer-global">
            <p-divider></p-divider>
            <div class="flex items-center justify-end p-1.5">
              <p class="text-sm text-gray-500">Ejercicio realizado para Grupo Castores</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-shell {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }

      .app-layout {
        display: flex;
        height: 100%;
        width: 100%;
      }

      /* Sidebar */
      .app-sidebar {
        height: 100%;
        background: var(--bg-sidebar);
        overflow: hidden;
        flex-shrink: 0;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .app-sidebar.expanded {
        width: 280px;
      }

      .app-sidebar.collapsed {
        width: 0;
      }

      /* Main Content */
      .app-main-wrapper {
        flex: 1;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr var(--footer-height);
        overflow: hidden;
      }

      .app-page-container {
        overflow: auto;
      }

      .app-footer-global {
        @apply bg-canvas-w;
      }

      /* Indicador cuando el sidebar está colapsado */
      .sidebar-collapsed-indicator {
        position: absolute;
        left: 0;
        top: 0;
        width: 8px;
        height: 100%;
        cursor: e-resize;
        z-index: 100;
        transition: all 0.2s ease;
      }

      .sidebar-collapsed-indicator:hover {
        width: 12px;
      }

      .sidebar-collapsed-indicator:hover .indicator-line {
        @apply bg-primary-w w-[2px];
      }

      .indicator-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background-color: var(--color-stroke-w);
        transition: all 0.2s ease;
      }

      /* Responsive */
      @media (max-width: 1240px) {
        .app-sidebar.collapsed {
          width: 0;
          overflow: hidden;
        }
      }
    `,
  ],
  imports: [CommonModule, RouterOutlet, SidebarMenuComponent, Divider],
  providers: [provideIcons({ tablerNote })],
})
export class AppTemplate implements OnInit {
  protected readonly authFacadeService = inject(AuthFacadeService);
  protected readonly userFacadeService = inject(UserFacadeService);
  protected readonly layoutService = inject(LayoutService);

  constructor() {}

  ngOnInit(): void {}
}

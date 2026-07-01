import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerArrowLeft, tablerChevronLeft } from '@ng-icons/tabler-icons';
import { get } from 'lodash';
import { UserInterface } from '../../interfaces';
import { LayoutService, SidebarPreference } from '../../services/layout.service';
import { OrganizationSelectorComponent } from './organization-selector.component';
import { SidebarMenuItem, SidebarMenuItemComponent } from './sidebar-menu-item.component';
import { UserProfileSectionComponent } from './user-profile-section.component';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

interface MenuContext {
  id: string;
  title: string;
  items: SidebarMenuItem[];
  backTo?: string;
  backToLabel?: string;
  defaultRoute?: string;
}

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  imports: [
    CommonModule,
    OrganizationSelectorComponent,
    SidebarMenuItemComponent,
    UserProfileSectionComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ tablerArrowLeft, tablerChevronLeft })],
})
export class SidebarMenuComponent {
  // Services
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected layoutService = inject(LayoutService);

  user: InputSignal<UserInterface | null> = input<UserInterface | null>(null);

  logout: OutputEmitterRef<void> = output<void>();

  isOverlay = computed(() => {
    const isCollapsed = !this.layoutService.sidebarLayoutState();
    const sidebarPref: SidebarPreference = this.layoutService.sidebarPreference();
    if (isCollapsed && sidebarPref === null) {
      return true;
    } else if (isCollapsed && sidebarPref === 'collapse') {
      return true;
    } else if (isCollapsed && sidebarPref === 'expand') {
      return true;
    }
    return false;
  });

  // Computed que refleja el estado del sidebar desde el LayoutService
  // true = collapsed, false = expanded
  isCollapsed = computed(() => !this.layoutService.sidebarLayoutState());

  // Estado del hover del borde interactivo
  isResizeHandleHovered = false;

  // Sistema de navegación entre menús
  currentMenuId = signal<string>('main');
  isTransitioning = signal(false);

  // Definición de todos los menús disponibles
  private menus = signal<Record<string, MenuContext>>({
    main: {
      id: 'main',
      title: 'Menú Principal',
      items: this.getMainMenuItems(),
      defaultRoute: '/o/follow-ups',
    },
  });

  // Computed para obtener el menú actual
  currentMenu = computed(() => this.menus()[this.currentMenuId()]);

  // Computed para los items del menú actual
  currentMenuItems = computed(() => this.currentMenu().items);

  // Computed para saber si se puede regresar
  canGoBack = computed(() => !!this.currentMenu().backTo);

  routerSignal: Signal<NavigationEnd | undefined>;
  constructor() {
    this.routerSignal = toSignal(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
    );

    effect(() => {
      this.routerSignal();
      const navId: string = get(this.route.snapshot.firstChild?.data, 'navId');
      if (!navId) return;
      if (this.menus()[navId]) {
        this.currentMenuId.set(navId);
      } else {
        this.currentMenuId.set('main');
      }
    });
  }

  private getMainMenuItems(): SidebarMenuItem[] {
    return [
      {
        label: 'Inicio',
        route: `/videos`,
        icon: 'tablerPhotoVideo',
      },
      {
        label: 'Mis favoritos',
        route: `/videos/favorites`,
        icon: 'tablerStar',
      },
    ];
  }

  /**
   * Navega a un menú específico con animación
   */
  navigateToMenu(menuId: string): void {
    if (this.menus()[menuId] && this.currentMenuId() !== menuId) {
      this.isTransitioning.set(true);

      setTimeout(() => {
        this.currentMenuId.set(menuId);
        setTimeout(() => {
          this.isTransitioning.set(false);
          if (this.currentMenu().defaultRoute) {
            // revisar que no se peude redirigir a la misma en la que se esta actualmente
            this.router.navigate([this.currentMenu()!.defaultRoute!], {
              queryParamsHandling: 'preserve',
            });
          }
        }, 50); // Pequeña espera para completar la animación de entrada
      }, 200); // Duración de la animación de salida
    }
  }

  /**
   * Regresa al menú anterior
   */
  goBack(): void {
    const backTo = this.currentMenu().backTo;
    if (backTo) {
      this.navigateToMenu(backTo);
    }
  }

  /**
   * Método para agregar nuevos menús dinámicamente
   */
  addMenu(menu: MenuContext): void {
    this.menus.update(menus => ({ ...menus, [menu.id]: menu }));
  }

  /**
   * Toggle del estado del sidebar (colapsar/expandir)
   * Utiliza el LayoutService para mantener el estado sincronizado
   */
  toggleCollapse(): void {
    this.layoutService.toggleSidebar();
  }

  /**
   *  Emite el evento de logout
   */
  onLogout(): void {
    this.logout.emit();
  }
}

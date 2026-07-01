import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

/**
 * Configuración del paginador
 */
export interface PaginatorConfig {
  /** Total de registros */
  totalRecords: number;
  /** Número de registros por página (default: 10) */
  rows?: number;
  /** Página actual (0-indexed, default: 0) */
  first?: number;
  /** Opciones de registros por página (default: [10, 20, 30, 50]) */
  rowsPerPageOptions?: number[];
  /** Mostrar el selector de registros por página (default: true) */
  showPageLinks?: boolean;
  /** Mostrar información de la página actual (default: true) */
  showCurrentPageReport?: boolean;
  /** Template para el reporte de página actual */
  currentPageReportTemplate?: string;
}

/**
 * Evento emitido cuando cambia la página
 */
export interface PageChangeEvent {
  /** Índice del primer registro (0-indexed) */
  first: number;
  /** Número de registros por página */
  rows: number;
  /** Número de página actual (0-indexed) */
  page: number;
  /** Total de páginas */
  pageCount: number;
}

/**
 * Componente de paginador reutilizable
 * 
 * @example
 * ```html
 * <app-paginator
 *   [config]="{ totalRecords: 100, rows: 10 }"
 *   (pageChange)="onPageChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-paginator
      [rows]="config().rows ?? 10"
      [totalRecords]="config().totalRecords"
      [first]="config().first ?? 0"
      [rowsPerPageOptions]="config().rowsPerPageOptions ?? [10, 20, 30, 50]"
      [showPageLinks]="config().showPageLinks ?? true"
      [showCurrentPageReport]="config().showCurrentPageReport ?? true"
      [currentPageReportTemplate]="
        config().currentPageReportTemplate ??
        'Mostrando {first} a {last} de {totalRecords} registros'
      "
      (onPageChange)="handlePageChange($event)"
    />
  `,
  imports: [PaginatorModule],
})
export class PaginatorComponent {
  /**
   * Configuración del paginador
   */
  config: InputSignal<PaginatorConfig> = input.required<PaginatorConfig>();

  /**
   * Evento emitido cuando cambia la página
   */
  pageChange: OutputEmitterRef<PageChangeEvent> = output<PageChangeEvent>();

  /**
   * Maneja el cambio de página
   */
  protected handlePageChange(event: PaginatorState): void {
    this.pageChange.emit({
      first: event.first ?? 0,
      rows: event.rows ?? 10,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? 0,
    });
  }
}

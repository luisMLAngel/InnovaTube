import { Injectable, Signal, computed } from '@angular/core';
import { createStore, Store } from '@ngneat/elf';
import {
  withEntities,
  selectAllEntities,
  selectEntity,
  upsertEntities,
  deleteEntities,
  withActiveId,
  getActiveEntity,
  setActiveId,
  selectActiveId,
  selectActiveEntity,
} from '@ngneat/elf-entities';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, of, firstValueFrom, combineLatest } from 'rxjs';

/**
 * ════════════════════════════════════════════════════════════════
 * BASE STORE - Clase abstracta para Elf Stores
 * ════════════════════════════════════════════════════════════════
 *
 * Implementa la lógica común de todos los stores:
 * - Entities store con withEntities
 * - State history (undo/redo) para entities
 * - Selectores reactivos (signals)
 * - Métodos CRUD básicos (upsert, remove)
 * - Gestión de entidad activa
 *
 * @template T - Tipo de la entidad principal (ej: FollowUpInterface)
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ClientsStoreService extends BaseStore<ClientInterface> {
 *   protected storeName = 'clients';
 * }
 * ```
 */
@Injectable()
export abstract class BaseStore<T extends { id: string }> {
  /**
   * Nombre del store (debe ser único en la aplicación)
   * DEBE ser definido como propiedad en la clase hija ANTES del constructor
   */
  protected storeName!: string;

  /**
   * Store interno de Elf
   */
  protected readonly store: Store;

  /**
   * Plugin de historial para entidades
   */
  private readonly entitiesHistory: any;

  /**
   * Signal con todas las entidades
   */
  readonly entities: Signal<T[]>;

  /**
   * Signal con todas las entidades EXCEPTO la activa
   */
  readonly entitiesWithoutCurrent: Signal<T[]>;

  /**
   * Signal con la entidad activa
   */
  readonly activeEntity: Signal<T | undefined>;

  /**
   * Constructor - Inicializa el store con entities
   * IMPORTANTE: La clase hija debe definir storeName antes de llamar super()
   */
  constructor(storeName: string) {
    this.storeName = storeName;

    // Crear el store con entities
    this.store = createStore(
      { name: this.storeName },
      withEntities<T>({ idKey: 'id' }),
      withActiveId({ idKey: 'id' }),
    );

    // Inicializar historial para entities
    this.entitiesHistory = entitiesStateHistory(this.store);

    // Inicializar signal de entidades
    this.entities = toSignal(this.store.pipe(selectAllEntities()), {
      initialValue: [] as T[],
    });

    // Inicializar signal de entidad activa
    this.activeEntity = toSignal(this.store.pipe(selectActiveEntity()), {
      initialValue: undefined,
    });

    // Signal de entidades SIN la entidad activa
    this.entitiesWithoutCurrent = toSignal(
      combineLatest([this.store.pipe(selectAllEntities()), this.store.pipe(selectActiveId())]).pipe(
        map(([entities, activeId]) => {
          return entities.filter(entity => entity.id !== activeId);
        }),
      ),
      {
        initialValue: [] as T[],
      },
    );
  }

  /**
   * Obtener una entidad específica por ID
   */
  readonly getEntity = (id: string) => {
    return this.store.pipe(selectEntity(id));
  };

  // ════════════════════════════════════════════════════════════════
  // ACTIVE ENTITY - GESTIÓN DE ENTIDAD ACTIVA
  // ════════════════════════════════════════════════════════════════

  /**
   * Establecer una entidad como activa por su ID
   */
  setActive(id: string | null): void {
    this.store.update(setActiveId(id));
  }

  /**
   * Limpiar la entidad activa
   */
  clearActive(): void {
    this.store.update(setActiveId(null));
  }

  // ════════════════════════════════════════════════════════════════
  // COMANDOS - CRUD BÁSICO
  // ════════════════════════════════════════════════════════════════

  /**
   * Insertar o actualizar una entidad
   */
  upsert(entity: T): void {
    this.store.update(upsertEntities(entity));
  }

  /**
   * Insertar o actualizar múltiples entidades
   */
  upsertMany(entities: T[]): void {
    this.store.update(upsertEntities(entities));
  }

  /**
   * Eliminar una entidad por ID
   */
  remove(id: string): void {
    this.store.update(deleteEntities(id));
  }

  /**
   * Eliminar múltiples entidades por IDs
   */
  removeMany(ids: string[]): void {
    this.store.update(deleteEntities(ids));
  }

  // ════════════════════════════════════════════════════════════════
  // HISTORY - UNDO/REDO
  // ════════════════════════════════════════════════════════════════

  /**
   * Deshacer cambios en una entidad
   */
  undoEntity(id?: string): void {
    if (id) {
      this.entitiesHistory.undo(id);
    }
  }

  /**
   * Rehacer cambios en una entidad
   */
  redoEntity(id?: string): void {
    if (id) {
      this.entitiesHistory.redo(id);
    }
  }

  /**
   * Verificar si hay historial pasado (puede hacer undo)
   */
  canUndoEntity(id?: string): boolean {
    return id ? this.entitiesHistory.hasPast(id) : false;
  }

  /**
   * Verificar si hay historial futuro (puede hacer redo)
   */
  canRedoEntity(id?: string): boolean {
    return id ? this.entitiesHistory.hasFuture(id) : false;
  }
}

import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments';
import { BaseService } from './base.service';
import { DataBaseServiceResponse } from './interfaces/data-base-service-response.interface';
import { ErrorHandlerService } from '../../services';

/**
 * ════════════════════════════════════════════════════════════════
 * INTERFACES GENÉRICAS PARA RESPONSES
 * ════════════════════════════════════════════════════════════════
 */

/** Response genérica para operaciones CRUD */
export interface CrudResponse<T> {
  data: T;
  message: string;
}

/** Response genérica para listados con paginación */
export interface CrudListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Opciones de paginación */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/** Opciones de filtrado */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * ════════════════════════════════════════════════════════════════
 * BASE CRUD SERVICE
 * ════════════════════════════════════════════════════════════════
 *
 * Servicio base genérico que implementa operaciones CRUD estándar.
 *
 * @template T - Tipo de la entidad
 * @template CreateDto - DTO para crear entidad
 * @template UpdateDto - DTO para actualizar entidad
 *
 * USO:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ClientService extends BaseCrudService<
 *   ClientInterface,
 *   CreateClientDto,
 *   UpdateClientDto
 * > {
 *   protected override endpoint = 'clients';
 *
 *   // Métodos adicionales específicos del servicio
 *   async getClientsByOrganization(orgId: string) { ... }
 * }
 * ```
 */
export abstract class BaseCrudService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected readonly SERVER: string = environment.SERVER;
  protected readonly baseService = inject(BaseService);
  protected readonly errorHandlerService = inject(ErrorHandlerService);

  private endpoint: string;
  /**
   * Endpoint del recurso (debe ser definido por el servicio hijo)
   * Ejemplo: 'clients', 'follow-ups', 'users'
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Nombre de la propiedad en el response que contiene la entidad
   * Por defecto: nombre del endpoint en singular
   * Puede ser sobrescrito por servicios hijos
   */
  protected get entityKey(): string {
    // Convertir 'clients' -> 'client', 'follow-ups' -> 'followUp'
    return this.endpoint.replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/s$/, '');
  }

  /**
   * Nombre de la propiedad en el response que contiene el array de entidades
   * Por defecto: nombre del endpoint
   * Puede ser sobrescrito por servicios hijos
   */
  protected get entitiesKey(): string {
    // Convertir 'follow-ups' -> 'followUps'
    return this.endpoint.replace(/-([a-z])/g, g => g[1].toUpperCase());
  }

  /**
   * Construir la URL completa del endpoint
   */
  protected buildUrl(path: string = ''): string {
    const basePath = `${this.SERVER}/${this.endpoint}`;
    return path ? `${basePath}/${path}` : basePath;
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: GET ALL (Lista con paginación)
   * ════════════════════════════════════════════════════════════════
   */
  async getAll(options: PaginationOptions & FilterOptions = {}): Promise<CrudListResponse<T>> {
    const { page = 1, pageSize = 20, ...filters } = options;
    const params = { page, pageSize, ...filters };

    const response: DataBaseServiceResponse<any> = await firstValueFrom(
      this.baseService.get<any>(this.buildUrl(), void 0, { params }),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }

    // Intentar extraer datos de la estructura del response
    const data = response.entity || [];
    const total = response.entity?.total || 0;

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: GET BY ID (Obtener una entidad por ID)
   * ════════════════════════════════════════════════════════════════
   */
  async getById(id: string): Promise<T> {
    const response: DataBaseServiceResponse<any> = await firstValueFrom(
      this.baseService.get<any>(this.buildUrl(id)),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }

    // Intentar extraer la entidad de la estructura del response
    return response.entity;
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: CREATE (Crear nueva entidad)
   * ════════════════════════════════════════════════════════════════
   */
  async create(dto: CreateDto): Promise<T> {
    const response: DataBaseServiceResponse<any> = await firstValueFrom(
      this.baseService.post<any>(this.buildUrl(), dto),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }

    return response.entity;
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: UPDATE (Actualizar entidad existente)
   * ════════════════════════════════════════════════════════════════
   */
  async update(id: string, dto: UpdateDto): Promise<T> {
    const response: DataBaseServiceResponse<any> = await firstValueFrom(
      this.baseService.patch<any>(this.buildUrl(id), dto),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }

    return response.entity;
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: DELETE (Eliminar una entidad)
   * ════════════════════════════════════════════════════════════════
   */
  async delete(id: string): Promise<void> {
    const response: DataBaseServiceResponse<void> = await firstValueFrom(
      this.baseService.delete<void>(this.buildUrl(id)),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MÉTODO: DELETE MANY (Eliminar múltiples entidades)
   * ════════════════════════════════════════════════════════════════
   */
  async deleteMany(ids: string[]): Promise<void> {
    const response: DataBaseServiceResponse<void> = await firstValueFrom(
      this.baseService.post<void>(this.buildUrl('bulk/delete'), { ids }),
    );

    if (response.error) {
      throw this.errorHandlerService.createRequestException(response.serverResponse);
    }
  }
}

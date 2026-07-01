/**
 * ════════════════════════════════════════════════════════════════
 * ENTIDAD PRINCIPAL - CLIENT
 * ════════════════════════════════════════════════════════════════
 */

/** Interfaz principal del dominio Organization */
export interface OrganizationInterface {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * ════════════════════════════════════════════════════════════════
 * UI ENTITIES - DRAFTS Y FLAGS TEMPORALES
 * ════════════════════════════════════════════════════════════════
 */

/** Entidad UI para manejar drafts y estados temporales */
export interface OrganizationUIInterface {
  id: string;
  isDraft?: boolean;
  isEditing?: boolean;
  tempData?: Partial<OrganizationInterface>;
}

/**
 * ════════════════════════════════════════════════════════════════
 * TIPOS DERIVADOS - FORMULARIOS Y DTOs
 * ════════════════════════════════════════════════════════════════
 */

/** Datos del formulario (campos que se editan en el form) */
export type OrganizationFormData = {
  name: string;
};

/** DTO para crear una nueva organización */
export type CreateOrganizationDto = OrganizationFormData & {
  organizationId?: string;
};

/** DTO para actualizar una organización (todos opcionales) */
export type UpdateOrganizationDto = Partial<CreateOrganizationDto>;

/**
 * ════════════════════════════════════════════════════════════════
 * RESPONSES DE LA API
 * ════════════════════════════════════════════════════════════════
 */

export type OrganizationResultResponse = Pick<OrganizationInterface, 'id' | 'name'>;

/** Response al crear/actualizar una organización */
export interface OrganizationResponse {
  organization: OrganizationResultResponse;
  message: string;
}

/** Response al listar organizaciones con paginación */
export interface OrganizationListResponse {
  organizations: OrganizationResultResponse[];
  total: number;
  page: number;
  pageSize: number;
}

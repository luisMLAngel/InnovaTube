import { OrganizationInterface, UserInterface } from '../../../core/interfaces';

/**
 * ════════════════════════════════════════════════════════════════
 * ENTIDADES PRINCIPALES - AUTH
 * ════════════════════════════════════════════════════════════════
 */

/** Credenciales de usuario para login */
export interface UserCredentialsInterface {
  email: string;
  password: string;
}

/** Response de autenticación (token) */
export interface AuthResponseInterface {
  accessToken: string;
  refreshToken?: string;
  user: UserInterface;
}

/** Datos del usuario autenticado con sus organizaciones */
export interface AuthMeInterface {
  user: UserInterface;
  organization: OrganizationInterface;
  accessToken: string;
}

export interface AuthForgotPasswordInterface {
  resetToken: string;
}

/** Payload para restablecer contraseña */
export interface ResetPasswordRequestInterface {
  token: string;
  newPassword: string;
}

/** Response de restablecer contraseña */
export interface ResetPasswordResponseInterface {
  success: boolean;
}

/**
 * ════════════════════════════════════════════════════════════════
 * TIPOS DERIVADOS - DTOs
 * ════════════════════════════════════════════════════════════════
 */

/** DTO para crear un nuevo usuario (registro) */
export type CreateUserDto = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

/** DTO para crear una nueva organización */
export type CreateOrganizationDto = {
  name: string;
};

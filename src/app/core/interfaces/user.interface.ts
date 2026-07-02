import { OrganizationInterface } from './organization.interface';

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserRegistrationInterface {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface MeInterface {
  user: UserInterface;
  organization: OrganizationInterface;
}

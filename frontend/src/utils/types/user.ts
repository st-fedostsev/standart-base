import type { Role } from './roles';

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  //   organization - TODO: уточнить нужно ли
  role: Role;
  avatarUrl?: string;
};

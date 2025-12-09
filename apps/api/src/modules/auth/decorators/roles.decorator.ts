import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const AdminOnly = () => Roles("admin");
export const ManagerOnly = () => Roles("manager");
export const OwnerOnly = () => Roles("owner");

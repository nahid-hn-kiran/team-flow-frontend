export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string | null;
}

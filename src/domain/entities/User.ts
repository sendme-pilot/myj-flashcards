export type UserRole = 'admin' | 'staff';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

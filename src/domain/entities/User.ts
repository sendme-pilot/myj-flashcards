export type UserRole = 'admin' | 'committed';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

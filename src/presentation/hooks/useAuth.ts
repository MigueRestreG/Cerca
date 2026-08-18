import { createContext, useContext } from 'react';
import { can, has, type Actor, type Capacity, type Permission } from '@/domain/actor';

export interface AuthContextValue {
  actor: Actor | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useCan(permission: Permission): boolean {
  const { actor } = useAuth();
  if (!actor) return false;
  return can(actor, permission);
}

export function useHasCapacity(capacity: Capacity): boolean {
  const { actor } = useAuth();
  if (!actor) return false;
  return has(actor, capacity);
}

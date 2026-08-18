import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { Permission, Capacity } from '@/domain/actor';
import { can, has } from '@/domain/actor';
import { useAuth } from '../hooks/useAuth';

export interface CanProps {
  permission?: Permission;
  capacity?: Capacity;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, capacity, fallback, children }: CanProps) {
  const { actor } = useAuth();

  const allowed = useMemo(() => {
    if (!actor) return false;
    if (permission) return can(actor, permission);
    if (capacity) return has(actor, capacity);
    return true;
  }, [actor, permission, capacity]);

  if (!allowed) {
    return fallback ?? null;
  }

  return children;
}

export function withCapacity<P extends object>(
  Component: React.ComponentType<P>,
  capacity: Capacity,
): React.ComponentType<P> {
  const Wrapped = (props: P) => (
    <Can capacity={capacity}>
      <Component {...props} />
    </Can>
  );
  Wrapped.displayName = `withCapacity(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
): React.ComponentType<P> {
  const Wrapped = (props: P) => (
    <Can permission={permission}>
      <Component {...props} />
    </Can>
  );
  Wrapped.displayName = `withPermission(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
}

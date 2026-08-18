export type Capacity = 'customer' | 'provider';
export type PlatformRole = 'user' | 'moderator' | 'admin';

export interface Actor {
  readonly id: string;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
}

export type Permission =
  | 'listing:read'
  | 'listing:create'
  | 'listing:update'
  | 'listing:moderate'
  | 'booking:request'
  | 'booking:accept'
  | 'review:write'
  | 'review:moderate'
  | 'report:resolve'
  | 'user:suspend';

const CAPACITY_PERMISSIONS: Record<Capacity, Permission[]> = {
  customer: ['listing:read', 'booking:request', 'review:write', 'report:resolve'],
  provider: ['listing:read', 'listing:create', 'listing:update', 'booking:accept', 'review:write'],
};

const PLATFORM_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  user: [],
  moderator: ['listing:moderate', 'review:moderate', 'report:resolve'],
  admin: ['listing:moderate', 'review:moderate', 'report:resolve', 'user:suspend'],
};

export const has = (actor: Actor, capacity: Capacity): boolean => actor.capacities.includes(capacity);

export function can(actor: Actor, permission: Permission): boolean {
  const fromCapacities = actor.capacities.some((c) => CAPACITY_PERMISSIONS[c].includes(permission));
  const fromRole = PLATFORM_PERMISSIONS[actor.platformRole].includes(permission);
  return fromCapacities || fromRole;
}

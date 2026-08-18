import type { ApiActor, ApiCapacity } from '@/api/types';

export type LocalAuthUser = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  capacities: ApiCapacity[];
};

const USERS_KEY = 'cerca_local_auth_users';
let memoryUsers: LocalAuthUser[] = [];

function readUsersFromStorage(): LocalAuthUser[] {
  try {
    if (typeof localStorage === 'undefined') {
      return memoryUsers;
    }

    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return memoryUsers;
    }

    const parsed = JSON.parse(raw) as LocalAuthUser[];
    if (!Array.isArray(parsed)) {
      return memoryUsers;
    }

    memoryUsers = parsed;
    return parsed;
  } catch {
    return memoryUsers;
  }
}

function writeUsersToStorage(users: LocalAuthUser[]) {
  memoryUsers = users;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch {
    // Ignore storage failures and keep memory fallback.
  }
}

export function createLocalActor(user: LocalAuthUser): ApiActor {
  return {
    id: user.id,
    capacities: user.capacities,
    platformRole: 'user',
  };
}

export function registerLocalUser(input: {
  email: string;
  password: string;
  displayName: string;
  capacities?: ApiCapacity[];
}): LocalAuthUser {
  const users = readUsersFromStorage();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = users.find((user) => user.email === normalizedEmail);
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const user: LocalAuthUser = {
    id: `local-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: normalizedEmail,
    password: input.password,
    displayName: input.displayName,
    capacities: input.capacities && input.capacities.length > 0 ? input.capacities : ['customer'],
  };

  writeUsersToStorage([...users, user]);
  return user;
}

export function authenticateLocalUser(input: { email: string; password: string }): LocalAuthUser {
  const users = readUsersFromStorage();
  const normalizedEmail = input.email.trim().toLowerCase();

  const user = users.find((item) => item.email === normalizedEmail);
  if (!user || user.password !== input.password) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return user;
}

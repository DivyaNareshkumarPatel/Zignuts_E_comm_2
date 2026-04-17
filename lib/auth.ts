import { createHash, randomBytes } from 'crypto';

export type AuthRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface TokenEntry {
  userId: string;
  expiresAt: number;
}

const users = new Map<string, StoredUser>();
const accessTokens = new Map<string, TokenEntry>();
const refreshTokens = new Map<string, TokenEntry>();

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return randomBytes(48).toString('hex');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function cleanupExpiredTokens(map: Map<string, TokenEntry>) {
  const now = Date.now();
  for (const [token, entry] of map.entries()) {
    if (entry.expiresAt <= now) {
      map.delete(token);
    }
  }
}

export function getUserByEmail(email: string): StoredUser | null {
  return users.get(normalizeEmail(email)) ?? null;
}

export function getUserById(id: string): StoredUser | null {
  return Array.from(users.values()).find((user) => user.id === id) ?? null;
}

export function registerUser(email: string, password: string, role: AuthRole = 'user'): AuthUser {
  const normalizedEmail = normalizeEmail(email);
  if (users.has(normalizedEmail)) {
    throw new Error('User already exists');
  }

  const user: StoredUser = {
    id: `user-${users.size + 1}`,
    email: normalizedEmail,
    role,
    passwordHash: hashPassword(password),
  };

  users.set(normalizedEmail, user);
  return { id: user.id, email: user.email, role: user.role };
}

export function authenticateUser(email: string, password: string): AuthUser | null {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  if (user.passwordHash !== hashPassword(password)) {
    return null;
  }

  return { id: user.id, email: user.email, role: user.role };
}

export function createAccessToken(userId: string): string {
  cleanupExpiredTokens(accessTokens);
  const token = createToken();
  accessTokens.set(token, {
    userId,
    expiresAt: Date.now() + ACCESS_TOKEN_TTL_MS,
  });
  return token;
}

export function createRefreshToken(userId: string): string {
  cleanupExpiredTokens(refreshTokens);
  const token = createToken();
  refreshTokens.set(token, {
    userId,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_MS,
  });
  return token;
}

export function verifyRefreshToken(token: string): string | null {
  cleanupExpiredTokens(refreshTokens);
  const entry = refreshTokens.get(token);
  if (!entry) {
    return null;
  }
  return entry.userId;
}

export function revokeRefreshToken(token: string) {
  refreshTokens.delete(token);
}

export function verifyAccessToken(token: string): string | null {
  cleanupExpiredTokens(accessTokens);
  const entry = accessTokens.get(token);
  if (!entry) {
    return null;
  }
  return entry.userId;
}

export function getPublicUserById(id: string): AuthUser | null {
  const user = getUserById(id);
  if (!user) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
}

// Seed a default demo account.
try {
  registerUser('admin@example.com', 'password', 'admin');
} catch (error) {
  // ignore if already registered
}

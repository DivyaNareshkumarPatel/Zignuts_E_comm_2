import { createHash, randomBytes } from 'crypto';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

const usersCollection = collection(db, 'users');
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

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const q = query(usersCollection, where('email', '==', normalizedEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as StoredUser;
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const snapshot = await getDoc(doc(usersCollection, id));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as StoredUser;
}

export async function registerUser(email: string, password: string, role: AuthRole = 'user'): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user: StoredUser = {
    id: `user-${Date.now()}-${randomBytes(4).toString('hex')}`,
    email: normalizedEmail,
    role,
    passwordHash: hashPassword(password),
  };

  await setDoc(doc(usersCollection, user.id), user);
  return { id: user.id, email: user.email, role: user.role };
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await getUserByEmail(email);
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

export async function getPublicUserById(id: string): Promise<AuthUser | null> {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
}

void (async () => {
  try {
    await registerUser('admin@example.com', 'password', 'admin');
  } catch (error) {
    // ignore if already registered
  }
})();

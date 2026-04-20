import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
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

const usersCollection = collection(db, 'users');

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'dev-token-secret';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function signToken(userId: string, type: 'access' | 'refresh', ttl: number): string {
  const payload = JSON.stringify({ userId, type, exp: Date.now() + ttl });
  const signature = createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

function verifyToken(token: string, expectedType: 'access' | 'refresh'): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const separatorIndex = decoded.lastIndexOf('.');
    if (separatorIndex === -1) {
      return null;
    }

    const payload = decoded.slice(0, separatorIndex);
    const signature = decoded.slice(separatorIndex + 1);
    const expected = createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const parsed = JSON.parse(payload) as { userId: string; type: 'access' | 'refresh'; exp: number };
    if (parsed.type !== expectedType || parsed.exp <= Date.now()) {
      return null;
    }

    return parsed.userId;
  } catch {
    return null;
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
  return signToken(userId, 'access', ACCESS_TOKEN_TTL_MS);
}

export function createRefreshToken(userId: string): string {
  return signToken(userId, 'refresh', REFRESH_TOKEN_TTL_MS);
}

export function verifyRefreshToken(token: string): string | null {
  return verifyToken(token, 'refresh');
}

export function revokeRefreshToken(_token: string) {
}

export function verifyAccessToken(token: string): string | null {
  return verifyToken(token, 'access');
}

export async function getPublicUserById(id: string): Promise<AuthUser | null> {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
}
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_APP_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
  measurementId: env.NEXT_PUBLIC_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
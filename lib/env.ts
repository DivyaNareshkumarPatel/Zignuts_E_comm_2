import { z } from "zod";

const clientSchema = z.object({
    NEXT_PUBLIC_API_KEY: z.string().min(1, "API Key is missing"),
    NEXT_PUBLIC_AUTH_DOMAIN: z.string().min(1, "Auth Domain is missing"),
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1, "Project ID is missing"),
    NEXT_PUBLIC_STORAGE_BUCKET: z.string().min(1, "Storage Bucket is missing"),
    NEXT_PUBLIC_APP_ID: z.string().min(1, "App ID is missing"),
    NEXT_PUBLIC_MEASUREMENT_ID: z.string().optional(),
});

const serverSchema = z.object({
    FIREBASE_CLIENT_EMAIL: z.string().email("Invalid Firebase Client Email"),
    FIREBASE_PRIVATE_KEY: z.string().min(1, "Firebase Private Key is missing"),
});

const _clientEnv = clientSchema.safeParse({
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
});

if (!_clientEnv.success) {
    console.error("Invalid Client environment variables:\n", _clientEnv.error.format());
    throw new Error("Invalid Client environment variables. Check your .env file.");
}

let serverEnvData = {} as z.infer<typeof serverSchema>;

if (typeof window === "undefined") {
    const _serverEnv = serverSchema.safeParse({
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    });

    if (!_serverEnv.success) {
        console.error("❌ Invalid Server environment variables:\n", _serverEnv.error.format());
        throw new Error("Invalid Server environment variables. Check your .env file.");
    }

    serverEnvData = _serverEnv.data;
}

export const env = {
    ..._clientEnv.data,
    ...serverEnvData,
};
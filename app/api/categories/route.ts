import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin, isAuthError } from '@/lib/api-auth';

export async function GET() {
    try {
        const snapshot = await adminDb.collection("categories").get();
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (isAuthError(auth)) return auth;

    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const docRef = await adminDb.collection("categories").add({
            name: body.name,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
}
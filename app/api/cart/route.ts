import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAuth, isAuthError } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    try {
        const { userId, items } = await request.json();
        if (userId !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await setDoc(doc(db, 'carts', userId), {
            items,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    if (userId !== auth.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const docSnap = await getDoc(doc(db, 'carts', userId));
        if (docSnap.exists()) {
            return NextResponse.json(docSnap.data().items || []);
        }
        return NextResponse.json([]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, updateDoc, increment, setDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAuth, requireAdmin, isAuthError } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    try {
        const { userId, items, total } = await request.json();

        // Ensure user is placing order for themselves
        if (userId !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!userId || !items || items.length === 0) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        const orderRef = await addDoc(collection(db, 'orders'), {
            userId,
            items,
            total,
            status: 'Processing',
            createdAt: new Date().toISOString()
        });

        for (const item of items) {
            const productRef = doc(db, 'products', item.id);
            await updateDoc(productRef, {
                stock: increment(-item.quantity)
            });
        }

        await setDoc(doc(db, 'carts', userId), { items: [] });

        return NextResponse.json({ success: true, orderId: orderRef.id }, { status: 201 });
    } catch (error) {
        console.error("Order POST Error:", error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If fetching a specific user's orders → require that user to be authenticated
    // If fetching all orders (admin use) → require admin
    if (userId) {
        const auth = await requireAuth(request);
        if (isAuthError(auth)) return auth;

        // Users can only fetch their own orders
        if (userId !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    } else {
        const auth = await requireAdmin(request);
        if (isAuthError(auth)) return auth;
    }

    try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        let orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Array<{ id: string; userId: string; [key: string]: unknown }>;

        if (userId) {
            orders = orders.filter(o => o.userId === userId);
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error("GET Orders Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
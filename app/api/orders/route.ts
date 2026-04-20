import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
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

        // 1. Create the order
        const orderRef = await adminDb.collection('orders').add({
            userId,
            items,
            total,
            status: 'Processing',
            createdAt: new Date().toISOString()
        });

        // 2. Decrement stock for each product
        for (const item of items) {
            const productRef = adminDb.collection('products').doc(item.id);
            await productRef.update({
                stock: FieldValue.increment(-item.quantity)
            });
        }

        // 3. Clear the user's cart
        await adminDb.collection('carts').doc(userId).set({ items: [] });

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
        // Fetch orders sorted by newest first
        const snapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
        let orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Array<{ id: string; userId: string;[key: string]: unknown }>;

        // Filter by user if a userId was provided
        if (userId) {
            orders = orders.filter(o => o.userId === userId);
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error("GET Orders Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
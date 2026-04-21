import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin, isAuthError } from '@/lib/api-auth';
export const revalidate = 3600;

export async function GET() {
    try {
        const snapshot = await adminDb.collection("products").get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products, {
            headers: {
                'X-Cache-Status': 'Cached'
            }
        });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (isAuthError(auth)) return auth;

    try {
        const body = await request.json();

        const docRef = await adminDb.collection("products").add({
            name: body.name,
            price: Number(body.price),
            stock: Number(body.stock),
            categoryId: body.categoryId || null,
            createdAt: new Date().toISOString()
        });

        revalidatePath('/api/products');
        revalidatePath('/products');

        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
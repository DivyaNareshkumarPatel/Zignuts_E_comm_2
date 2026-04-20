import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAdmin, isAuthError } from '@/lib/api-auth';

// Public — anyone can view products (for storefront)
export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// Admin only — create new product
export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (isAuthError(auth)) return auth;

    try {
        const body = await request.json();

        const docRef = await addDoc(collection(db, "products"), {
            name: body.name,
            price: Number(body.price),
            stock: Number(body.stock),
            categoryId: body.categoryId || null,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
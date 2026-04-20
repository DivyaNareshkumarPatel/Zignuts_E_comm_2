import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAdmin, isAuthError } from '@/lib/api-auth';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (isAuthError(auth)) return auth;

    try {
        const { id } = await context.params;
        const { status }: { status: string } = await request.json();

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, { status, updatedAt: new Date().toISOString() });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH Order Error:", error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin, isAuthError } from '@/lib/api-auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (isAuthError(auth)) return auth;

    try {
        const { status } = await request.json();
        const { id } = await params;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        await adminDb.collection("orders").doc(id).update({ status });

        return NextResponse.json({ success: true, id, status });
    } catch (error) {
        console.error("PATCH Order Error:", error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
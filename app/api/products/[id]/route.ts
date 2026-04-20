import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin, isAuthError } from '@/lib/api-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { id } = await params;
    await adminDb.collection("products").doc(id).update(body);

    return NextResponse.json({ success: true, id, ...body });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await adminDb.collection("products").doc(id).delete();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
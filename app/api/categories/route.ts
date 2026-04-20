import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const docRef = await addDoc(collection(db, "categories"), {
            name: body.name,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
}

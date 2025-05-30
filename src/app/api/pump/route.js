import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { db } from "@/lib/firebaseAdmin"

export async function GET(req) {
    try {
        const snapshot = await db.collection('rows').get();
        const pumps = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            pumps[doc.id] = data.pumpOn;
        });
        return new Response(JSON.stringify(pumps), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
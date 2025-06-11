// src/app/api/moisture/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import OpenAI from "openai";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getSuggestion(temperature, humidity, light, moisture) {
    const prompt = `
        Give short and concise feedback for this plant based on these monitoring data.
        Weather:
        - Temperature: ${temperature}°C
        - Humidity: ${humidity}%
        - Light: ${light}
        - Moisture: ${moisture}
        `;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful agricultural assistant." },
            { role: "user", content: prompt }
        ],
        max_tokens: 200
    });
    const suggestion = response.choices[0]?.message?.content ?? "No suggestion available.";

    return suggestion;
}

export async function POST(req) {
    const { temperature, humidity, light, rows } = await req.json();

    const batch = db.batch()

    try {


        // for (var element in rows) {
        //     const { id, moisture, pumpOn } = element;
        //     const time = new Date().toISOString();

        //     const feedback = await getSuggestion(temperature, humidity, light, moisture);
        //     batch.set(
        //         db.collection("rows").doc(
        //             id),
        //         {
        //             feedback,
        //             moisture,
        //             pumpOn,
        //             time,
        //         },
        //         { merge: true }
        //     );
        // }


        batch.set(db.collection("weather").doc("tempreature"), { value: temperature }, { merge: true });

        batch.set(db.collection("weather").doc("humidity"), { value: humidity }, { merge: true });

        batch.set(db.collection("weather").doc("light"), { value: light }, { merge: true });

        await batch.commit();
        return NextResponse.json({ message: "Data updated" });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

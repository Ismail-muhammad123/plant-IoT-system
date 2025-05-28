'use client';

import Link from 'next/link';

export default function RowCard({ rowId, data }) {
    const { temperature, humidity, moisture, light, feedback, plantName = 'Unnamed Plant' } = data;

    return (
        <Link href={`/row/${rowId}`}>
            <div className="p-4 bg-white rounded-2xl shadow shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-bold"> Row: {plantName}</h2>
                <p>🌡 Temp: {temperature}°C</p>
                <p>💧 Moisture: {moisture}%</p>
                <p>☀️ Light: {light}</p>
                <p className="italic text-sm text-gray-600 mt-2">{feedback?.message}</p>
            </div>
        </Link>
    );
}

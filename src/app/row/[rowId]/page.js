'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { PlantStat } from "@/components/PlantStat";

export default function PlantDetail() {
    const [weather, setWeather] = useState([
        { label: "🌡 Temp:", value: "--" },
        { label: "💦 Humidity:", value: "--" },
        { label: "💡 Time:", value: "--" }
    ]);

    const { rowId } = useParams();

    const [data, setData] = useState({});
    const [plantName, setPlantName] = useState('');
    const [pumpOn, setPumpOn] = useState(false);

    useEffect(() => {
        const docRef = doc(firestore, 'rows', rowId);
        const unsub = onSnapshot(docRef, (docSnap) => {
            const val = docSnap.data();
            if (val) {
                setData(val);
                setPlantName(val.plantName || '');
                setPumpOn(val.pumpOn || false);
            }
        });
        return () => unsub();
    }, [rowId]);

    const togglePump = async () => {
        await updateDoc(doc(firestore, 'rows', rowId), {
            pumpOn: !pumpOn
        });
    };

    const savePlantName = async () => {
        await updateDoc(doc(firestore, 'rows', rowId), {
            plantName
        });
    };


    useEffect(() => {
        // Listen for plant rows
        const unsubRows = onSnapshot(collection(firestore, 'rows'), (snapshot) => {
            const updatedRows = {};
            snapshot.forEach((doc) => {
                updatedRows[doc.id] = doc.data();
            });
            setPlantRows(updatedRows);
        });

        // Listen for weather data
        const unsubWeather = onSnapshot(collection(firestore, 'weather'), (snapshot) => {
            const weatherData = {};
            snapshot.forEach((doc) => {
                weatherData[doc.id] = doc.data().value;
            });
            setWeather([
                { label: "🌡 Temp:", value: `${weatherData.temperature} °C` || "--" },
                { label: "💦 Humidity:", value: weatherData.humidity || "--" },
                { label: "💡 Time:", value: weatherData.light || "--" }
            ]);
        });

        return () => {
            unsubRows();
            unsubWeather();
        };
    }, []);

    return (
        <main className="min-h-screen max-h-[400px] p-x-auto bg-green-50 flex flex-col items-start p-6 relative overflow-hidden">

            <button
                className="self-start text-2xl mb-4 bg-white"
                onClick={() => window.location.href = '/'}
                aria-label="Back to home"
            >
                <div className='rounded shadow p-3'>
                    ←
                </div>
            </button>

            <h2 className="text-2xl font-semibold">{plantName}</h2>
            <p className="text-gray-500 mb-6">{rowId}</p>

            <div className="w-35 text-align-start max-w-md space-y-4 z-10">
                {weather.map((stat) => (<PlantStat key={stat.label} label={stat.label} value={stat.value} />))}
                <PlantStat label="Moisture" value="87%" bg="bg-gray-100" />
            </div>

            {/* Foreground plant image on the right */}
            <div className="absolute right-0 top-1/2 bottom-0 -translate-y-1/2 z-[3] pointer-events-none">
                <img src="/plant.png" alt="Bell Pepper" className="w-80 h-100 opacity-100" />
            </div>
        </main>
    );
}

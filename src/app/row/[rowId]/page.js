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
            setData(updatedRows);
        });

        // Listen for weather data
        const unsubWeather = onSnapshot(collection(firestore, 'weather'), (snapshot) => {
            const weatherData = {};
            snapshot.forEach((doc) => {
                weatherData[doc.id] = doc.data().value;
            });
            setWeather([
                { label: "🌡 Temp:", value: `${weatherData.temperature} °C` || "--" },
                { label: "💦 Humidity:", value: weatherData.humidity + "%" || "--" },
                { label: "💡 Time:", value: weatherData.light || "--" }
            ]);
        });

        return () => {
            unsubRows();
            unsubWeather();
        };
    }, []);

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(plantName);

    useEffect(() => {
        setEditName(plantName);
    }, [plantName]);

    return (
        <main className="min-h-screen max-w-[600px] mx-auto p-x-auto bg-green-50 flex flex-col items-start p-6 relative overflow-hidden">

            <button
                className="self-start text-2xl mb-4 bg-white"
                onClick={() => window.location.href = '/'}
                aria-label="Back to home"
            >
                <div className='rounded shadow p-3'>
                    ←
                </div>
            </button>

            <div className="flex items-center gap-2">
                {!editing ? (
                    <>
                        <h2 className="text-2xl font-semibold">{plantName}</h2>
                        <button
                            className="ml-2 text-gray-500 hover:text-green-600"
                            aria-label="Edit plant name"
                            onClick={() => setEditing(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <form
                        className="flex items-center gap-2"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await savePlantName();
                            setEditing(false);
                        }}
                    >
                        <input
                            className="border rounded px-2 py-1 text-lg"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            onClick={async (e) => {
                                e.preventDefault();
                                setPlantName(editName);
                                await updateDoc(doc(firestore, 'rows', rowId), { plantName: editName });
                                setEditing(false);
                            }}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                                setEditName(plantName);
                                setEditing(false);
                            }}
                            aria-label="Cancel edit"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>

            <p className="text-gray-500 mb-6">{rowId}</p>

            <div className="flex items-center mb-6">
                <span className="mr-3 font-medium">Pump</span>
                <label className="inline-flex relative items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={pumpOn}
                        onChange={togglePump}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        {pumpOn ? "On" : "Off"}
                    </span>
                </label>
            </div>

            <div className="w-35 text-align-start max-w-md space-y-4 z-10">
                {weather.map((stat) => (<PlantStat key={stat.label} label={stat.label} value={stat.value} />))}
                <PlantStat label="Moisture" value="87%" bg="bg-gray-100" />
            </div>

            {/* Foreground plant image on the right */}
            <div className="absolute right-0 top-1/2 bottom-0 -translate-y-1/4 z-[3] pointer-events-none">
                <img src="/plant.png" alt="Bell Pepper" className="w-80 h-100 opacity-80" />
            </div>
        </main>
    );
}

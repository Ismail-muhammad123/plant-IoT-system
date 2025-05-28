'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { AlertBox } from "@/components/AlertBox";
import { PlantCard } from "@/components/PlantCard";
import { PlantStat } from "@/components/PlantStat";

export default function Home() {

  const [plantRows, setPlantRows] = useState({});
  const [weather, setWeather] = useState([
    { label: "Temp:", value: "--" },
    { label: "Humidity:", value: "--" },
    { label: "Day light:", value: "--" }
  ]);


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
        { label: "Temp:", value: `${weatherData.temperature} °C` || "--" },
        { label: "Humidity:", value: weatherData.humidity || "--" },
        { label: "Day light:", value: weatherData.light || "--" }
      ]);
    });

    return () => {
      unsubRows();
      unsubWeather();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white p-6 space-y-6">
      <h1 className="text-3xl font-semibold capitalize">My Plants</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {weather.map((stat) => (<PlantStat key={stat.label} label={stat.label} value={stat.value} />))}
      </div>

      <AlertBox
        plant="Eggplant"
        message="This plant needs water (110ml)"
      />

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(plantRows).map(([rowId, data]) => (
          <PlantCard id={rowId} key={rowId} name={data.plantName} moisture={data.moisture} />
        ))}
      </div>
    </main>
  );
}

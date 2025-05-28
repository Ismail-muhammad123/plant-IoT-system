export function PlantStat({ label, value, bg }/*: { label: string; value: string; bg: string }*/) {
    return (
        <div className="shadow rounded-2xl bg-white p-5 flex-1">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <h1 className="text-2xl font-bold text-black">{value}</h1>
        </div>
    );
}

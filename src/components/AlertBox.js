
export function AlertBox({ plant, message }/* :{ plant: string; message: string }*/) {
    return (
        <div className="bg-green-100 text-black-700 shadow rounded p-4 space-y-1">
            <div className="font-medium">{plant}</div>
            <div className="text-sm">{message}</div>
        </div>
    );
}

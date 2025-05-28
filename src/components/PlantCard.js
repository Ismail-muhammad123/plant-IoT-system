import Image from "next/image";
import Link from "next/link";

export function PlantCard({ id, name, moisture, image = "/plant.png" }/*: { name: string; image: string }*/) {
    return (
        <Link href={`/row/${id}`} className="block">

            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 min-w-[320px]">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 relative">
                        <Image
                            src={image}
                            alt={name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-medium">{name}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Moisture:</span>
                    <span className="text-base font-semibold text-blue-600">{/* Moisture level placeholder */} {moisture || '--'} %</span>
                </div>
            </div>
        </Link>
    );
}

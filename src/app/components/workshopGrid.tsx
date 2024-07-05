import { GlareCard } from "./glare-card";
import Image from "next/image";
import workshopData from "../data/workshopData.json"

export function GlarecardWorkshop() {
    return (
        <section className="bg-black py-8">
            <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {workshopData.map((workshop, index) => (
                    <GlareCard key={index} className="relative flex flex-col items-start justify-end p-6 overflow-hidden group">
                        <Image
                            src={workshop.src}
                            alt={workshop.name}
                            width={500}
                            height={500}
                            className="h-full w-full absolute inset-0 object-cover"
                        />
                        <div className="relative z-10 bg-black bg-opacity-70 p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                            <p className="font-bold text-white text-lg uppercase">{workshop.name}</p>
                            <p className="font-normal text-base text-neutral-200 mt-2">
                                {workshop.description}
                            </p>
                        </div>
                    </GlareCard>
                ))}
            </div>
        </section>
    );
}
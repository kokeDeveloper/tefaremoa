import Image from "next/image";
import React from "react";
import { Timeline } from "./timelineTFM";

export function TimelineTFM() {
    const data = [
        {
            title: "2017",
            content: (
                <div>
                    <h3 className="text-neutral-800 dark:text-neutral-200 text-xs md:text-3xl mb-8">Fundación de Te Fare Mo&apos;a</h3>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Deserunt consectetur cupidatat consequat cillum magna veniam. Cillum voluptate ad ipsum nisi pariatur amet dolor ea eiusmod ea.
                        Non sunt consectetur pariatur anim.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="/misalumnas2017.jpg"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "2018",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            abril
                        </p>
                        <h3 className="text-neutral-800 dark:text-neutral-200 text-xs md:text-3xl mb-8">
                            1er Flashmob &apos;Ori Tahiti, Santiago de Chile
                        </h3>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Lorem ipsum is for people who are too lazy to write copy. But we are
                            not. Here are some more example of beautiful designs I built.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <Image
                                src="/flashmob2018.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            agosto
                        </p>
                        <h3 className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Workshop MP
                        </h3>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Lorem ipsum is for people who are too lazy to write copy. But we are
                            not. Here are some more example of beautiful designs I built.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/jutzilduque.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                            <Image
                                src="/claudiohuesca.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                            <Image
                                src="/mjroman.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>

                </>

            ),
        },
        {
            title: "2019",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            mayo
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            2do Flashmob &apos;Ori Tahiti, Santiago de Chile
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/flashmob2019.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            julio
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            1era gala de Te fare mo&apos;a
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/gala2019.PNG"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            agosto
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Workshop Mareva Boucheaux (Frencia-Tahiti)
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/mareva 2019.jpeg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            noviembre
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Workshop Lili Tanematea (México-Tahiti)
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/LILI.jpeg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>

                    </div>

                </>



            ),
        },
        {
            title: "2020",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            mayo
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            3er Flashmob Online &apos;Ori Tahiti
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/flashmob2020.png"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            junio
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            3° lugar solista categoría maestra
                        </p>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Te Varua o Te &apos;Ori Online 2021
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/HeivaVirtual2020.JPG"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                </>

            ),
        },
        {
            title: "2021",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            febrero
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Gala online “Haere mai i te heiva”
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/galaonline.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            mayo
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            2° lugar solista categoría profesional
                        </p>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            E Ua No Fetia Online 2021
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/euanofetia.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            agosto
                        </p>

                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            3° lugar solista categoría maestra y 1° lugar orquesta creación
                        </p>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Te Varua o Te &apos;Ori Online 2021
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <Image
                                src="/tevaruaori2021.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                            <Image
                                src="/orquesta2021.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>

                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            septiembre
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            1° lugar solista categoría profesional 35 +, Heiva I San Diego Online 2021 – USA
                        </p>
                        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            E Ua No Fetia Online 2021
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/heivasandiego.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
                        </div>
                    </div>
                </>
            ),
        },
        {
            title: "2022",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            julio
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            1° lugar categoría Mehura, &apos;Aito International Competition Online 2022 – México.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/mehura2022.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                </>
            ),
        },
        {
            title: "2023",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            noviembre
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Presentación en el Festival Vívelo
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/galaonline.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                </>
            ),
        },
        {
            title: "2024",
            content: (
                <>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            mayo
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                        Workshop Ranitea Laughlin
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/ranitea.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            noviembre
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                            Presentación en el Festival Vívelo
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/galaonline.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <p className="text-neutral-500 text-sm md:text-lg font-normal uppercase mb-2">
                            diciembre
                        </p>
                        <p className="text-neutral-200 text-xs md:text-3xl mb-8">
                        Workshop Moon Tahiti
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Image
                                src="/moonWS-2024.jpg"
                                alt="hero template"
                                width={500}
                                height={500}
                                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                            />
                        </div>
                    </div>
                </>
            ),
        },




    ];
    return (
        <div className="w-full">
            <Timeline data={data} />
        </div>
    );
}

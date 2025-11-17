import React from "react";
import { TimelineCompact, TimelineYear } from "./TimelineCompact";

export function TimelineTFM() {
    const data: TimelineYear[] = [
        {
            year: "2017",
            events: [
                {
                    title: "Fundación de Te Fare Mo'a",
                    description: "Mujeres de la familia, junto con un grupo de coaches ontológicos de Newfield Network nos acompañaron en el proceso para darle forma a la identidad de la academia. Fueron aprendices por el mes de enero y posteriormente abrimos en marzo del mismo año, partiendo de cero.",
                    images: [
                        { src: "/misalumnas2017.jpg", alt: "Alumnas 2017" }
                    ]
                }
            ]
        },
        {
            year: "2018",
            events: [
                {
                    month: "Abril",
                    title: "1er Flashmob 'Ori Tahiti, Santiago de Chile",
                    description: "Encuentro que unió a academias de danza polinésica y agrupaciones, con le fin de bailar una coreografía creada por Mareva Boucheaux, organizadora mundial de este evento. La academia hizo una invitación a ser todos parte de esta gran organización",  
                    images: [
                        { src: "/flashmob2018.jpg", alt: "Flashmob 2018" }
                    ]
                },
                {
                    month: "Agosto",
                    title: "Workshop MP",
                    description: "Programa de entrenamiento para profesoras, bailarinas y músicos traído desde México, impartido por Yutzil Duque, María José Román y Claudio Huesca.",
                    images: [
                        { src: "/jutzilduque.jpg", alt: "Jutzil Duque" },
                        { src: "/claudiohuesca.jpg", alt: "Claudio Huesca" },
                        { src: "/mjroman.jpg", alt: "MJ Roman" }
                    ]
                }
            ]
        },
        {
            year: "2019",
            events: [
                {
                    month: "Mayo",
                    title: "2do Flashmob 'Ori Tahiti, Santiago de Chile",
                    description:"Encuentro que convocó a más de 324 personas. En esta segunda versión fuimos la ciudad más numerosa dentro de las 50 que participaron pertenecientes a diferentes lugares de América, Europa y Oceanía",
                    images: [
                        { src: "/flashmob2019.jpg", alt: "Flashmob 2019" }
                    ]
                },
                {
                    month: "Julio",
                    title: "1era gala de Te Fare Mo'a",
                    images: [
                        { src: "/gala2019.PNG", alt: "Gala 2019" }
                    ]
                },
                {
                    month: "Agosto",
                    title: "Workshop Mareva Boucheaux (Francia-Tahiti)",
                    description:"El nivel de participación de bailarines en el Flashmob de ese año generó en Mareva un gran interés por conocernos, por lo que realizamos nuestro primer workshop con una profesora extranjera. Asistieron en total 152 bailarinas.",
                    images: [
                        { src: "/mareva 2019.jpeg", alt: "Mareva Boucheaux" }
                    ]
                },
                {
                    month: "Noviembre",
                    title: "Workshop Lili Tanematea (México-Tahiti)",
                    images: [
                        { src: "/LILI.jpeg", alt: "Lili Tanematea" }
                    ]
                }
            ]
        },
        {
            year: "2020",
            events: [
                {
                    month: "Mayo",
                    title: "3er Flashmob Online 'Ori Tahiti",
                    images: [
                        { src: "/flashmob2020.png", alt: "Flashmob Online 2020" }
                    ]
                },
                {
                    month: "Junio",
                    title: "3 lugar solista categoría maestra",
                    description: "Te Varua o Te 'Ori Online 2021",
                    images: [
                        { src: "/HeivaVirtual2020.JPG", alt: "Heiva Virtual 2020" }
                    ]
                }
            ]
        },
        {
            year: "2021",
            events: [
                {
                    month: "Febrero",
                    title: "Gala online 'Haere mai i te heiva'",
                    images: [
                        { src: "/galaonline.jpg", alt: "Gala Online 2021" }
                    ]
                },
                {
                    month: "Mayo",
                    title: "2 lugar solista categoría profesional",
                    description: "E Ua No Fetia Online 2021",
                    images: [
                        { src: "/euanofetia.jpg", alt: "E Ua No Fetia 2021" }
                    ]
                },
                {
                    month: "Agosto",
                    title: "3 lugar solista categoría maestra y 1 lugar orquesta creación",
                    description: "Te Varua o Te 'Ori Online 2021",
                    images: [
                        { src: "/tevaruaori2021.jpg", alt: "Te Varua Ori 2021" },
                        { src: "/orquesta2021.jpg", alt: "Orquesta 2021" }
                    ]
                },
                {
                    month: "Septiembre",
                    title: "1 lugar solista categoría profesional 35+",
                    description: "Heiva I San Diego Online 2021  USA",
                    images: [
                        { src: "/heivasandiego.jpg", alt: "Heiva San Diego 2021" }
                    ]
                }
            ]
        },
        {
            year: "2022",
            events: [
                {
                    month: "Julio",
                    title: "1 lugar categoría Mehura, 'Aito International Competition Online 2022  México",
                    images: [
                        { src: "/mehura2022.jpg", alt: "Mehura 2022" }
                    ]
                }
            ]
        },
        {
            year: "2023",
            events: [
                {
                    month: "Noviembre",
                    title: "Presentación en el Festival Vívelo",
                    images: [
                        { src: "/galaonline.jpg", alt: "Festival Vívelo 2023" }
                    ]
                }
            ]
        },
        {
            year: "2024",
            events: [
                {
                    month: "Mayo",
                    title: "Workshop Ranitea Laughlin",
                    images: [
                        { src: "/ranitea.jpg", alt: "Ranitea Laughlin Workshop" }
                    ]
                },
                {
                    month: "Noviembre",
                    title: "Presentación en el Festival Vívelo",
                    images: [
                        { src: "/galaonline.jpg", alt: "Festival Vívelo 2024" }
                    ]
                },
                {
                    month: "Diciembre",
                    title: "Workshop Moon Tahiti",
                    images: [
                        { src: "/moonWS-2024.jpg", alt: "Moon Tahiti Workshop" }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="w-full">
            <TimelineCompact data={data} initialOpen={0} />
        </div>
    );
}

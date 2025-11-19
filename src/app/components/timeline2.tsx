import React from "react";
import { TimelineCompact, TimelineYear } from "./TimelineCompact";

export function TimelineTFM() {
    const data: TimelineYear[] = [
        {
            year: "2017",
            events: [
                {
                    title: "Inicios de Te Fare Mo'a",
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
                    description: "Encuentro que unió a academias de danza polinésica y agrupaciones, con le fin de bailar una coreografía creada por Mareva Boucheaux, organizadora mundial de este evento. La academia hizo una invitación a ser todos parte de esta gran organización.",  
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
                    description:"Encuentro que convocó a más de 324 personas. En esta segunda versión fuimos la ciudad más numerosa dentro de las 50 que participaron pertenecientes a diferentes lugares de América, Europa y Oceanía.",
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
                    description: "Lili es una bailarina mexicana que lleva más de 40 años radicada en Tahiti. Sus ansias de conocimiento y pasión por la cultura tahitiana la llevaron a convertirse en traductora de reo Tahiti al español en el Conservatorio Te Fare Upa Rau y en profesora online de diferentes bailarinas internacionales. Lili vino a Chile a mostrarnos parte de lo conocido por ella en sus años de residente en Tahiti. Para ese evento asistieron 144 bailarinas.",
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
                    description: "En plena pandemia nos movilizamos para realizar el 3er flashmob a través de Zoom, en el que convocamos a más de 260 personas, siendo nuevamente Chile el país con más participación en esta Actividad. Ese año nos correspondió elaborar la música de la canción y la parte final de la coreografía. ",
                    images: [
                        { src: "/flashmob2020.png", alt: "Flashmob Online 2020" }
                    ]
                },
                {
                    month: "Noviembre",
                    title: "2° lugar, profesional Heiva ‘Ori Tahiti Competition Online",
                    description: "Primera competencia internacional online organizada por el maestro Hirohiti Tematahotoa. Participaron bailarinas provenientes de México, USA, Francia, España, Japón y Tahiti",
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
                    description: "Fue la primera vez que participaron estudiantes de diferentes regiones realizando un ‘ote’a creado por ellas. ",
                    videoUrl: "https://www.youtube.com/watch?v=RuVaem8UpZM",
                },
                {
                    month: "Mayo",
                    title: "2° lugar, profesional E Nua No Fetia – Online ",
                    description: "Los jueces que evaluaron fueron Manouche Lehartel, Tumata Vairaroa, Hinatea Colombani y Tahia Cambet. ",
                    images: [
                        { src: "/euanofetia.jpg", alt: "E Ua No Fetia 2021" }
                    ]
                },
                {
                    month: "Agosto",
                    title: "3° lugar solista categoría maestra - Te Varua o Te 'Ori Online 2021",
                    description: "as juezas que evaluaron fueron Makau Foster, Kohai Vahinetapairu y Almarose Moreno. 1° lugar orquesta creación ",
                    images: [
                        { src: "/tevaruaori2021.jpg", alt: "Te Varua Ori 2021" }
                    ]
                },
                {
                    month: "Noviembre",
                    title: "1 lugar solista categoría profesional 35+ -  Heiva I San Diego Online 2021  USA",
                    description: "Los jueces que evaluaron fueron los maestros del Conservatorio Artístico Te Fare ‘Upa Rau Fabien Mara, Vanina Ehu, Erena Uura y la conocida diseñadora y bailarina Tumata Vairaroa. ",
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
                    title: "1 lugar categoría Mehura, 'Aito International Competition Online 2022 México",
                    description: "Los jueces que evaluaron fueron los maestros Oliver Lenoir, Hugo Oopa y Sam Tetumu. ",
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
                    description: "Luego de un año de pausa (fuimos padres) retomamos nuestras clases una vez por semana y después de dos meses de preparación presentamos por primera vez en el Festival Vívelo, siendo nuestra motivación para continuar creciendo como academia.  ",
                    images: [
                        { src: "/vv21.jpg", alt: "Festival Vívelo 2023" }
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
                    description: "La ganadora del 3°lugar como bailarina solista del Heiva I Tahiti 2023, vino a nuestro país a realizar el primer workshop abierto y al alcance de gran parte de la comunidad polinésica en Chile. Asistieron más de 140 bailarinas y fue un éxito. ",
                    images: [
                        { src: "/ranitea.jpg", alt: "Ranitea Laughlin Workshop" }
                    ]
                },
                {
                    month: "Noviembre",
                    title: "Presentación en el Festival Vívelo",
                    description: "Participamos nuevamente en el Festival con una propuesta más completa y trabajada. ",
                    images: [
                        { src: "/vv2024-1.jpg", alt: "Festival Vívelo 2024" }
                    ]
                },
                {
                    month: "Diciembre",
                    title: "Workshop Moon Tahiti",
                    description:"Desde el Conservatorio Artístico de la Polinesia Francesa Te Fare ‘Upa Rau, vino a Chile Moon Urima, nieta de la fundadora del conservatorio Mamie Louise, quien nos envolvió con su personalidad y habilidades como maestra de ‘ori Tahiti. Sus workshops fueron un éxito, recibiendo a 175 bailarinas ansiosas por aprender y compartir con ella.  ",
                    images: [
                        { src: "/moonWS-2024.jpg", alt: "Moon Tahiti Workshop" }
                    ]
                }
            ]
        },
        {
            year: "2025",
            events: [
                {
                    month: "Junio",
                    title: "Te Fare Mo'a abre su propio estudio en Providencia - Santiago",
                    description: "Luego de 8 años de aprendizaje, Te Fare Mo’a abre su propio estudio en Providencia - Santiago, con nuevos horarios disponibles, lo que significó un importante paso para nosotros como directores y familia. ",
                    images: [
                        { src: "/letreroTFM.jpg", alt: "Letrero Te Fare Mo'a 2025" },
                        { src: "/estudioTFM.jpg", alt: "Estudio Te Fare Mo'a 2025" }
                    ]
                },
                {
                    month: "Octubre",
                    title: "Bárbara Macías se une al equipo de Te Fare Mo'a",
                    description: "Bárbara Macías Aravena se integra a nuestro equipo como apoyo en comunicaciones, registrando gran parte de nuestra esencia en clases y en nuestros eventos.",
                    images: [
                        { src: "/BarbaraTeam.jpg", alt: "Barbara Macías" }
                    ]   
                },
                {
                    month: "Noviembre",
                    title: "Festival Vívelo ",
                    description: "Presentamos por tercera vez con 26 bailarinas en escenario y música en vivo, mostrando una propuesta tradicional, elegante, sencilla y de mucha conexión con las temáticas presentadas por nuestras queridas bailarinas.  ",
                    videoUrl: "https://www.youtube.com/watch?v=XuL1q_hTTH8",
                },
                {
                    month: "Noviembre",
                    title: "Matarena Rapu Gazmuri se une al equipo de Te Fare Mo'a",
                    description: "Matarena Rapu Gazmuri se integra oficialmente a nuestro equipo como profesora de la academia, ofreciendo un nuevo horario.  ",
                    images: [
                        { src: "/MataTeam.jpg", alt: "Matarena Rapu Gazmuri" }
                    ]   
                },
                {
                    month: "Diciembre",
                    title: "Evaluación anual de alumnas",
                    description: "Iniciamos nuestro proceso de evaluación individual en el que todas las bailarinas observan, en conjunto con los directores, los avances logrados desde su entrada a la academia, planteándose nuevos objetivos y reafirmando otros que les permita continuar creciendo como personas y bailarinas.  ",
                    images: [
                        { src: "/evTFM25.jpg", alt: "Evaluación Anual 2025" }
                    ]   
                },
            ]
        }
    ];

    return (
        <div className="w-full">
            <TimelineCompact data={data} initialOpen={0} />
        </div>
    );
}

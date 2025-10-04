import Image from "next/image"
import Link from "next/link"
import { FaInstagram } from "react-icons/fa"


export default function NosotrosContent() {
    return (
        <section className="text-gray-600 body-font bg-black">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h2 className="mb-4 text-white tracking-widest text-7xl uppercase">Team</h2>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Te fare mo&apos;a es dirigida por Ángela y Jorge, ambos comprometidos profundamente con la cultura polinesia, especialmente con la danza y la música. </p>
                </div>
                <div className="flex flex-wrap -m-4">
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-start sm:justify-start justify-start text-left">
                            <Image
                                src="/tefaremoa.svg"
                                width={100}
                                height={100}
                                alt="TeFareLogo"
                            />
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-2xl text-white main-title">Ángela Ortiz Morales</h2>
                                <h3 className="text-gray-500 mb-3">Directora / Danza / Contenido </h3>
                                <p className="mb-4">Soy una aprendiz que admira la cultura y danza polinesia, en especial el &apos;ori Tahiti.
                                    Siendo coach ontológico de vida y organizacional, he vivenciado el poder transformacional del aprendizaje
                                    desde el cuerpo y acompaño a las bailarinas en este proceso, donde los avances dependen de los propósitos
                                    que cada una de ellas se plantea con el &apos;ori Tahiti. Mi pasión por la pedagogía, la oralitura y mitología
                                    de la polinesia se deben a mi formación como profesora de lenguaje. Admiro la manera en cómo esta cultura,
                                    en especial la tahitiana, celebra el llamado, la valoración de la vida y la naturaleza, así como el rescate
                                    de los orígenes y los efectos del sincretismo en la evolución de esta danza.
                                    <br />
                                    Dentro de los temas más esenciales, sanadores y desafiantes está el trabajo (interior) que la mujer tahitiana
                                    realiza con su identidad, junto con la sensualidad, ternura, fuerza y el coraje que la caracteriza dentro de la
                                    historia de la polinesia.
                                    <br />
                                    Mi línea de enseñanza está direccionada a aprender a danzar conectándonos con las emociones que traemos a diario
                                    y con aquellas que disfrutamos y evadimos.
                                    <br />
                                    Actualmente curso estudios de magíster en dirección y liderazgo educacional, ya que para mí es fundamental potenciar
                                    al máximo las herramientas que cada uno de nosotros trae a este mundo, pues en estas habita el sentido de nuestras vidas.
                                </p>
                                <Link href="https://www.instagram.com/angie_ortiz_morales?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="ml-2 text-gray-500 hover:text-gray-700">
                                    <FaInstagram className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:w-1/2">
                        <div className="h-full flex sm:flex-row flex-col items-start sm:justify-start justify-start text-left">
                            <Image
                                src="/tefaremoa.svg"
                                width={100}
                                height={100}
                                alt="TeFareLogo"
                            />
                            <div className="flex-grow sm:pl-8">
                                <h2 className="title-font font-medium text-2xl text-white main-title">Jorge Toledo Carvajal</h2>
                                <h3 className="text-gray-500 mb-3">Director / Música / Comunicaciones </h3>
                                <p className="mb-4">Mi viaje musical comenzó en 2017, cuando me uní a Manu Piri. Durante siete años,
                                    tuve la oportunidad de desarrollar mis habilidades en instrumentos de percusión tahitianos e instrumentos
                                    de cuerda. Este período fue una etapa enriquecedora y transformadora en mi vida artística. En 2019, tuve el
                                    honor de tocar con la orquesta del Conservatorio Artístico de la Polinesia Francesa en Tahití, una experiencia
                                    que amplió aún más mis horizontes musicales y me permitió conectar con el mana de la cultura polinesia. Actualmente,
                                    tengo el privilegio de dirigir la orquesta Te Fare Mo&apos;a y de ser músico en la orquesta del ballet cultural
                                    Kari Kari de Rapa Nui. Estas responsabilidades no solo me permiten continuar mi crecimiento artístico,
                                    sino también contribuir a la promoción y preservación de nuestras tradiciones culturales.
                                    Además de mi carrera musical, soy profesor de Educación Física e Ingeniero Informático. Esta combinación de disciplinas me ha dado una perspectiva única,
                                    permitiéndome integrar el arte y la tecnología en mi vida profesional y personal.
                                </p>
                                <Link href="https://www.instagram.com/koke_toledo/" className="ml-2 text-gray-500 hover:text-gray-700">
                                    <FaInstagram className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 
import React, { useState } from 'react';

const Pircing = () => {
    const [showPlans, setShowPlans] = useState(false);

    return (
        <section className="text-gray-400 bg-black body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-white">Mensualidad y Planes</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Seleciona la modalidad de clase que más te acomode.</p>
                    <div className="flex mx-auto border-2 border-red-600 rounded overflow-hidden mt-6">
                        <button className="py-1 px-4 bg-red-600 text-white focus:outline-none" onClick={() => setShowPlans(false)}>Mensual</button>
                        <button className="py-1 px-4 text-gray-300 focus:outline-none" onClick={() => setShowPlans(true)}>Planes</button>
                    </div>
                </div>
                <div className="flex flex-wrap -m-4">
                    {!showPlans ? (
                        <>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-gray-700 flex flex-col relative overflow-hidden">
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium uppercase">clase unitaria</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>$10.000</span>
                                        <span className="text-lg ml-1 font-normal text-gray-400">/clp</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Para quienes quieran tomar una clase de prueba o no puedan asistir de forma regular.
                                    </p>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Sujeto a disponibilidad de cupo.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                    <p className="text-xs text-gray-400 mt-3">Te fare mo&apos;a se reservará la participación de los asistentes que elijan esta modalidad a cualquier actividad artística relacionada con la academia.</p>
                                </div>
                            </div>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-gray-700 flex flex-col relative overflow-hidden">
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">Mensualidad bloque 1</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>$37.000</span>
                                        <span className="text-lg ml-1 font-normal text-gray-400">/clp</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Clase multinivel de 1,5 horas de duración.
                                    </p>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>La evolución de cada estudiante depende de los objetivos que se propone cada bailarina.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-red-600 flex flex-col relative overflow-hidden">
                                    <span className="bg-red-600 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">Mensualidad bloques 1 y 2</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>$47.000</span>
                                        <span className="text-lg ml-1 font-normal text-gray-400">/clp</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Suma a la primera clase una segunda clase de especialización 1,5 horas de duración.
                                    </p>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Recomendada para estudiantes que deseen profundizar conocimientos y/o alcanzar un nivel avanzado.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-red-600 border-0 py-2 px-4 w-full focus:outline-none hover:bg-red-500 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-gray-700 flex flex-col relative overflow-hidden">
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">Plan 1</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>Trimestral</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Reserva el cupo durante tres meses.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-gray-700 flex flex-col relative overflow-hidden">
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">Plan 2</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>Semestral</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Reserva el cupo durante seis meses.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
                                <div className="h-full p-6 rounded-lg border-2 border-gray-700 flex flex-col relative overflow-hidden">
                                    <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">Plan 3</h2>
                                    <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                        <span>Anual</span>
                                    </h1>
                                    <p className="flex items-center text-gray-400 mb-2">
                                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                                <path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                        </span>Reserva el cupo durante todo el año, con derecho a un mes de gracia.
                                    </p>
                                    <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Contacta aquí
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Pircing;
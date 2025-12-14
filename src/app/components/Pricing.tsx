"use client"
import { motion } from 'framer-motion';
import React from 'react';

interface PricingPlan {
    id: number;
    frequency: number;
    price: number;
    pricePerClass: number;
    isPopular?: boolean;
    savings?: string;
}

const monthlyPlans: PricingPlan[] = [
    {
        id: 1,
        frequency: 1,
        price: 39000,
        pricePerClass: 9750,
    },
    {
        id: 2,
        frequency: 2,
        price: 50000,
        pricePerClass: 6250,
        savings: '36% ahorro',
    },
    {
        id: 3,
        frequency: 3,
        price: 62000,
        pricePerClass: 5167,
        savings: '47% ahorro',
    },
    {
        id: 4,
        frequency: 4,
        price: 74000,
        pricePerClass: 4625,
        savings: '53% ahorro',
    },
    {
        id: 5,
        frequency: 5,
        price: 86000,
        pricePerClass: 4300,
        isPopular: true,
        savings: '56% ahorro',
    },
];

const Pricing = () => {
    const handleWhatsAppContact = (planType: 'monthly' | 'trial' | 'single', planDetails?: PricingPlan) => {
        const phoneNumber = '56971075886';
        let message = '';

        if (planType === 'monthly' && planDetails) {
            message = `Hola! Me interesa el plan de ${planDetails.frequency}x por semana por $${planDetails.price.toLocaleString('es-CL')} mensual. ¿Podrían darme más información?`;
        } else if (planType === 'trial') {
            message = `Hola! Me gustaría agendar una clase de prueba ($10.000). ¿Cuándo tienen disponibilidad?`;
        } else if (planType === 'single') {
            message = `Hola! Me interesa tomar una clase suelta ($10.000). ¿Cómo puedo reservar?`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section className="w-full py-16 md:py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Mensualidades y Planes 2025
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                        En todas las clases vemos <span className="text-orange-400 font-semibold">&apos;Ōte&apos;a</span> y <span className="text-orange-400 font-semibold">&apos;Aparima</span>
                    </p>
                </div>

                {/* Monthly Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                    {monthlyPlans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`
                                relative rounded-2xl p-6 flex flex-col
                                transition-all duration-300 group cursor-pointer
                                ${plan.isPopular 
                                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-400 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2' 
                                    : 'bg-gray-900/50 border-2 border-gray-700 hover:border-orange-400/50 hover:-translate-y-1'
                                }
                            `}
                        >
                            {/* Popular Badge */}
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-lg">
                                    ⭐ Mejor Valor
                                </div>
                            )}

                            {/* Savings Badge */}
                            {plan.savings && !plan.isPopular && (
                                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    {plan.savings}
                                </div>
                            )}

                            {/* Frequency */}
                            <div className="text-center mb-4">
                                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                    {plan.frequency}
                                    <span className="text-xl text-gray-400">x</span>
                                </div>
                                <p className="text-sm md:text-base text-gray-400 uppercase tracking-wide">
                                    por semana
                                </p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-4 flex-grow">
                                <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">
                                    ${plan.price.toLocaleString('es-CL')}
                                </div>
                                <p className="text-sm text-gray-400">mensual</p>
                                
                                {/* Price per class */}
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Precio por clase:</p>
                                    <p className="text-lg font-semibold text-green-400">
                                        ${Math.round(plan.pricePerClass).toLocaleString('es-CL')}
                                    </p>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button 
                                onClick={() => handleWhatsAppContact('monthly', plan)}
                                className={`
                                    w-full py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide
                                    transition-all duration-300
                                    ${plan.isPopular
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
                                        : 'bg-gray-800 text-white hover:bg-orange-500 hover:text-white'
                                    }
                                `}
                            >
                                Seleccionar Plan
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center my-12 md:my-16">
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                    <span className="px-6 text-gray-500 uppercase text-sm tracking-widest">Clases Sueltas</span>
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                </div>

                {/* Single Classes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Trial Class */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-400/30 hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 group"
                    >
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            PRUEBA
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                Clase de Prueba
                            </h3>
                            <p className="text-sm text-gray-400">
                                Para quienes quieran conocer la danza polinesia antes de comprometerse
                            </p>
                        </div>

                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-bold text-blue-400">$10.000</span>
                            <span className="text-gray-500 ml-2">CLP</span>
                        </div>

                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                1 clase de 1.5 horas
                            </li>
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Primera vez en la academia
                            </li>
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Sin compromiso
                            </li>
                        </ul>

                        <button 
                            onClick={() => handleWhatsAppContact('trial')}
                            className="w-full py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                        >
                            Agendar Prueba
                        </button>
                    </motion.div>

                    {/* Single Class */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="relative rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-2 border-purple-400/30 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 group"
                    >
                        <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            SUELTA
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                Clase Suelta
                            </h3>
                            <p className="text-sm text-gray-400">
                                Para quienes no pueden asistir de forma regular
                            </p>
                        </div>

                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-bold text-purple-400">$10.000</span>
                            <span className="text-gray-500 ml-2">CLP</span>
                        </div>

                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                1 clase de 1.5 horas
                            </li>
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Asiste cuando puedas
                            </li>
                            <li className="flex items-start text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Sujeto a disponibilidad
                            </li>
                        </ul>

                        <button 
                            onClick={() => handleWhatsAppContact('single')}
                            className="w-full py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300"
                        >
                            Reservar Clase
                        </button>
                    </motion.div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                        Los precios pueden variar según disponibilidad y temporada. 
                        <span className="text-orange-400"> Te Fare Mo&apos;a</span> se reserva el derecho de participación en actividades artísticas relacionadas con la academia.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;

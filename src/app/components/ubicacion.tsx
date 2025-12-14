"use client"
import { motion } from 'framer-motion';
import React from 'react';

const Ubicacion: React.FC = () => {
    const handleWhatsAppContact = () => {
        const phoneNumber = '56971075886';
        const message = 'Hola! Me gustaría obtener más información sobre la ubicación de la academia y cómo llegar.';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleDirections = () => {
        const address = 'Nueva Los Leones 030, Providencia, Santiago, Chile';
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <section className="w-full py-16 md:py-24 px-4 bg-black relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Ubicación
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                        Encuéntranos en el corazón de Providencia
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 hover:border-orange-400/50 transition-colors duration-300 h-[400px] md:h-[500px]"
                    >
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.146126607968!2d-70.60924322356651!3d-33.41943447340184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf69acf11379%3A0x7c22f2296f08d80c!2sNueva%20Los%20Leones%20030%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1762791518014!5m2!1ses-419!2scl" 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación Te Fare Mo'a - Nueva Los Leones 030, Providencia"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-gray-700 hover:border-orange-400/50 transition-colors duration-300 shadow-2xl"
                    >
                        {/* Address */}
                        <div className="mb-8">
                            <div className="flex items-start mb-4">
                                <div className="bg-orange-500/20 rounded-full p-3 mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                                        Caracol Los Leones
                                    </h3>
                                    <p className="text-lg text-gray-300 leading-relaxed">
                                        Av. Nueva Los Leones 030 - 030, Local 61
                                    </p>
                                    <p className="text-base text-gray-400">
                                        Providencia, Santiago
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metro */}
                        <div className="mb-8">
                            <div className="flex items-start mb-4">
                                <div className="bg-blue-500/20 rounded-full p-3 mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                                        Metro Los Leones /
                                    </h3>
                                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                                        Metro Tobalaba
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-8">
                            <div className="flex items-start mb-4">
                                <div className="bg-green-500/20 rounded-full p-3 mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                                        Contacto
                                    </h3>
                                    <p className="text-lg text-gray-300">
                                        +56 9 7107 5886
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                            <button
                                onClick={handleDirections}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                                Cómo Llegar
                            </button>
                            <button
                                onClick={handleWhatsAppContact}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-12 text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
                >
                    <p className="text-gray-400 text-sm md:text-base">
                        <span className="text-orange-400 font-semibold">Te Fare Mo&apos;a</span> está ubicada en una zona de fácil acceso, 
                        con excelente conectividad de transporte público y estacionamientos cercanos.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Ubicacion;

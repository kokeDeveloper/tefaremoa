"use client"
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import React, { useState, useCallback, useEffect } from 'react'

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    size: 'small' | 'medium' | 'large' | 'xlarge';
    title?: string;
    event?: string;
}

const data: GalleryItem[] = [
    { id: 1, src: '/gallery/abouthome.jpg', alt: 'Te Fare Moa al atardecer', size: 'large' },
    { id: 2, src: '/gallery/aparima%201.jpg', alt: 'Aparima 1', size: 'medium' },
    { id: 3, src: '/gallery/aparima%202.jpg', alt: 'Aparima 2', size: 'small' },
    { id: 4, src: '/gallery/azul.jpg', alt: 'Vestuario azul', size: 'medium' },
    { id: 5, src: '/gallery/azul2.JPG', alt: 'Tocado coralino', size: 'small' },
    { id: 6, src: '/gallery/chiquillas%202.jpg', alt: 'Grupo de alumnas 2', size: 'large' },
    { id: 7, src: '/gallery/chiquillas%20lunes.jpg', alt: 'Chiquillas lunes', size: 'medium' },
    { id: 8, src: '/gallery/chiquillas.jpg', alt: 'Grupo de alumnas', size: 'medium' },
    { id: 9, src: '/gallery/DSC_0288.jpg', alt: 'Escena en exterior', size: 'small' },
    { id: 10, src: '/gallery/foto%20chiquillas.jpg', alt: 'Fotografia de alumnas', size: 'large' },
    { id: 11, src: '/gallery/foto%20clases.jpg', alt: 'Clase en estudio', size: 'medium' },
    { id: 12, src: '/gallery/Grupo%20Tefaremoa-178.jpeg', alt: 'Elenco celebrando', size: 'xlarge' },
    { id: 13, src: '/gallery/Grupo%20Tefaremoa-193.jpeg', alt: 'Coreografia grupal 193', size: 'medium' },
    { id: 14, src: '/gallery/Grupo%20Tefaremoa-203.jpeg', alt: 'Saludo final 203', size: 'medium' },
    { id: 15, src: '/gallery/Grupo%20Tefaremoa-275.jpeg', alt: 'Círculo de energia', size: 'small' },
    { id: 16, src: '/gallery/IMG_3958.JPG', alt: 'Ensayo al aire libre', size: 'medium' },
    { id: 17, src: '/gallery/IMG_9503.jpg', alt: 'Ensayo con percusion', size: 'large' },
    { id: 18, src: '/gallery/IMG_9509.jpg', alt: 'Coreografia sincronizada', size: 'medium' },
    { id: 19, src: '/gallery/IMG_9518.jpg', alt: 'Mudras polinesios', size: 'small' },
    { id: 20, src: '/gallery/IMG_9522.jpg', alt: 'Acompanamiento docente', size: 'large' },
    { id: 21, src: '/gallery/IMG_9536.jpg', alt: 'Tecnica tradicional', size: 'medium' },
    { id: 22, src: '/gallery/IMG_9561.jpg', alt: 'Alegria en escena', size: 'small' },
    { id: 23, src: '/gallery/marcia.jpg', alt: 'Presentacion Marcia', size: 'medium' },
    { id: 24, src: '/gallery/negro.jpg', alt: 'Escena luz dorada', size: 'large' },
    { id: 25, src: '/gallery/vivelo%202023%201.jpg', alt: 'Vivelo 2023 1', size: 'medium' },
    { id: 26, src: '/gallery/vivelo%202024%201.jpg', alt: 'Vivelo 2024 1', size: 'small' },
    { id: 27, src: '/gallery/vivelo%202024.jpg', alt: 'Vivelo 2024', size: 'medium' },
    { id: 28, src: '/gallery/v%C3%ADvelo%202023%202.jpg', alt: 'Vivelo 2023 2', size: 'small' },
    { id: 29, src: '/gallery/v%C3%ADvelo%202024.jpg', alt: 'Vivelo 2024 presentacion', size: 'medium' },
    { id: 30, src: '/gallery/_DIJ6244.JPG', alt: 'Paso otea', size: 'medium' },
    { id: 31, src: '/gallery/_DIJ6368.JPG', alt: 'Guardianas del escenario', size: 'xlarge' },
    { id: 32, src: '/gallery/2.jpg', alt: 'Detalle floral', size: 'medium' },
    { id: 33, src: '/gallery/vic.jpg', alt: 'Detalle floral', size: 'small' }
]

// Configuración de tamaños para masonry grid
const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-2',
    xlarge: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
}

const GalleryClass = () => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = useCallback((id: number) => {
        setSelectedImage(id);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedImage(null), 300);
    }, []);

    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (selectedImage === null) return;
        const currentIndex = data.findIndex(item => item.id === selectedImage);
        const nextIndex = direction === 'next' 
            ? (currentIndex + 1) % data.length 
            : (currentIndex - 1 + data.length) % data.length;
        setSelectedImage(data[nextIndex].id);
    }, [selectedImage]);

    // Keyboard navigation
    useEffect(() => {
        if (!isModalOpen) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateImage('prev');
            if (e.key === 'ArrowRight') navigateImage('next');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, closeModal, navigateImage]);

    const selectedItem = data.find(item => item.id === selectedImage);

    return (
        <>
            <section className="w-full py-16 px-4 bg-black">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                            Galería
                        </h2>
                        <p className="text-sm md:text-base text-gray-400">
                            Momentos de danza, pasión y cultura polinesia
                        </p>
                    </div>

                    {/* Masonry Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 auto-rows-[180px] md:auto-rows-[220px] grid-flow-row-dense gap-4">
                        {data.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`
                                    ${sizeClasses[item.size]}
                                    relative rounded-xl overflow-hidden cursor-pointer group h-full
                                `}
                                onClick={() => openModal(item.id)}
                            >
                                {/* Image */}
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading={index < 4 ? 'eager' : 'lazy'}
                                />

                                {/* Overlay with gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                                {/* Orange accent border on hover */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 transition-all duration-300 rounded-xl z-30 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isModalOpen && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
                        onClick={closeModal}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-2xl flex items-center justify-center transition-colors"
                            aria-label="Cerrar modal"
                        >
                            ×
                        </button>

                        {/* Navigation buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage('prev');
                            }}
                            className="absolute left-4 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-2xl flex items-center justify-center transition-colors"
                            aria-label="Imagen anterior"
                        >
                            ‹
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage('next');
                            }}
                            className="absolute right-4 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-2xl flex items-center justify-center transition-colors"
                            aria-label="Imagen siguiente"
                        >
                            ›
                        </button>

                        {/* Image container */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-6xl w-full aspect-[4/3] mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedItem.src}
                                alt={selectedItem.alt}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                            />
                        </motion.div>

                        {/* Image info */}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default GalleryClass
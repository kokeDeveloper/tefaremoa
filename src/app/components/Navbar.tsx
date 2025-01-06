"use client"
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const Navbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hasDarkBackground, setHasDarkBackground] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            // User is scrolling down
            setIsVisible(false);
        } else {
            // User is scrolling up
            setIsVisible(true);
            setHasDarkBackground(currentScrollY > 0); // Apply dark background if scrolling up and not at the top
        }
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    }, [menuOpen]);

    return (
        <>
            <nav className={`flex justify-center items-center py-4 fixed top-0 w-full z-10 transition-transform duration-300 ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'} ${hasDarkBackground ? 'bg-black bg-opacity-75' : ''}`}>
                <div className="container flex justify-center items-center mx-auto px-4">
                    <button
                        className="text-white md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {!menuOpen && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>
                    <div className="hidden md:flex items-center space-x-4 uppercase">
                        <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium relative group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/nosotros" className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium relative group">
                            Nosotros
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/clases" className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium relative group">
                            Clases
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/workshops" className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium relative group">
                            Workshops
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/contacto" className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium relative group">
                            Contacto
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                </div>
            </nav>
            {/*Mobile menu*/}
            <div className={`md:hidden fixed inset-0 transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 z-20`}>
                <div className="bg-black bg-opacity-75 h-full">
                    <div className="flex flex-col justify-center items-center h-full space-y-4 uppercase">
                        <button
                            className="text-white absolute top-4"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <Link href="/" onClick={() => setMenuOpen(false)} className="text-white px-3 py-2 rounded-md text-lg font-medium relative group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/nosotros" onClick={() => setMenuOpen(false)} className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium relative group">
                            Nosotros
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/clases" onClick={() => setMenuOpen(false)} className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium relative group">
                            Clases
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/workshops" onClick={() => setMenuOpen(false)} className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium relative group">
                            Workshops
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pages/contacto" onClick={() => setMenuOpen(false)} className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium relative group">
                            Contacto
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Style to shift content when the menu is open */}
            <style jsx global>{`
                main {
                    transform: ${menuOpen ? 'translateY(100vh)' : 'translateY(0)'};
                    transition: transform 0.3s ease-in-out;
                }
            `}</style>
        </>
    );
};

export default Navbar;

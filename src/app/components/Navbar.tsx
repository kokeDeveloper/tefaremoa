"use client"
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { BsWhatsapp } from 'react-icons/bs'

const links = [
    { href: '/', label: 'Home' },
    { href: '/pages/nosotros', label: 'Nosotros' },
    { href: '/pages/clases', label: 'Clases' },
    { href: '/pages/eventos', label: 'Eventos' },
    { href: '/pages/contacto', label: 'Contacto' }
]

const phoneNumber = '56971075886'
const message = encodeURIComponent('Hola! Quiero saber más sobre Te Fare Mo’a ✨')
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

const Navbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [hasDarkBackground, setHasDarkBackground] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY
        const shouldShow = currentScrollY < lastScrollY || currentScrollY < 10
        setIsVisible(shouldShow)
        setHasDarkBackground(currentScrollY > 40)
        setLastScrollY(currentScrollY)
    }, [lastScrollY])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto'
    }, [menuOpen])

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-30 transition-all duration-300 ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${
                    hasDarkBackground
                        ? 'bg-black/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 py-4">
                        <Link href="/" className="text-left font-semibold tracking-[0.45em] text-white uppercase">
                            Te Fare Mo&apos;a
                        </Link>

                        <div className="hidden md:flex flex-1 justify-center">
                            <div className="flex items-center gap-2 uppercase text-sm font-medium">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group relative px-3 py-2 text-gray-200 transition hover:text-white"
                                    >
                                        {link.label}
                                        <span className="pointer-events-none absolute left-1/2 -bottom-1 h-px w-8 -translate-x-1/2 scale-x-0 bg-gradient-to-r from-orange-400 via-pink-400 to-rose-500 transition-transform duration-300 group-hover:scale-x-100" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="ml-auto hidden md:flex items-center gap-3">
                            <Link
                                href="/admin"
                                aria-label="Iniciar sesión"
                                className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 text-white transition"
                            >
                                <span className="absolute inset-0 rounded-full bg-white/5 blur-sm" />
                                <span className="absolute inset-0 rounded-full border border-white/40 opacity-30" />
                                <svg className="relative h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                                </svg>
                                <span className="sr-only">Iniciar sesión</span>
                            </Link>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Reservar por WhatsApp"
                                className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 text-white shadow-lg shadow-rose-500/30 transition"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500" />
                                <span className="absolute inset-0 rounded-full opacity-40" style={{
                                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 70%)'
                                }} />
                                <BsWhatsapp className="relative h-6 w-6" />
                                <span className="sr-only">Reservar por WhatsApp</span>
                            </a>
                        </div>

                        <button
                            className="md:hidden ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Abrir menú"
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-8 6h8"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`md:hidden fixed inset-0 z-20 transition-opacity duration-300 ${
                    menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setMenuOpen(false)} />
                <div className={`absolute inset-x-4 top-24 rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 p-8 text-center transition-transform duration-300 ${menuOpen ? 'translate-y-0' : '-translate-y-4'}`}>
                    <p className="text-xs uppercase tracking-[0.55em] text-orange-300 mb-6">Explora</p>
                    <div className="flex flex-col gap-4 text-lg font-semibold text-white">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="relative py-2"
                            >
                                {link.label}
                                <span className="absolute left-1/2 top-full h-px w-10 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 opacity-40" />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href="/admin"
                            aria-label="Iniciar sesión"
                            onClick={() => setMenuOpen(false)}
                            className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 text-white"
                        >
                            <span className="absolute inset-0 rounded-full bg-white/10" />
                            <svg className="relative h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                            </svg>
                            <span className="sr-only">Iniciar sesión</span>
                        </Link>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Reservar por WhatsApp"
                            className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 text-white shadow-lg shadow-rose-500/30"
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500" />
                            <span className="absolute inset-0 rounded-full opacity-40" style={{
                                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 70%)'
                            }} />
                            <BsWhatsapp className="relative h-6 w-6" />
                            <span className="sr-only">Reservar por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar

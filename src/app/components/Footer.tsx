import Image from "next/image";
import { Vortex } from "./vortex";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="text-gray-600 body-font bg-black overflow-hidden">
            <Vortex
                particleCount={200}
                baseHue={1}
                rangeHue={3}>
                <div className="container px-5 py-16 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                    <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
                            <Image
                                src="/tefaremoa.svg"
                                width={90}
                                height={90}
                                alt="TeFareLogo"
                            />
                        </a>
                        <p className="mt-2 text-sm text-white">Academia Continental de Danzas Polinesias</p><p>Providencia / Santiago / Chile</p>
                    </div>

                </div>
                <div className="bg-black">
                    <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                        <p className="text-gray-500 text-sm text-center sm:text-left">© 2024 Te Fare Mo&apos;a —
                            <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" className="text-gray-600 ml-1" target="_blank">@koke_toledo</a>
                        </p>
                        <Link href="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition-colors mx-auto sm:ml-auto sm:mx-0 mt-2 sm:mt-0 flex items-center gap-1.5" aria-label="Acceso administrativo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Admin
                        </Link>
                        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">

                            <Link href="https://www.instagram.com/tefaremoa?utm_source=ig_web_button_share_sheet&igshid=1v5z1z7z7z7z7" className="ml-3 text-gray-500">
                                <FaInstagram className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.facebook.com/tefaremoa" className="ml-3 text-gray-500">
                                <FaFacebook className="w-5 h-5" />
                            </Link>
                            <Link href="https://youtube.com/@academiatefaremoa3145?si=gNKlynap0f453zxR" className="ml-3 text-gray-500">
                                <FaYoutube className="w-5 h-5" />
                            </Link>
                        </span>
                    </div>
                </div>

            </Vortex>
        </footer>
    );
};

export default Footer
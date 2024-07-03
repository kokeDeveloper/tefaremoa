import React from 'react';
import { GoogleMap, LoadScript, Marker, } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    filter: 'grayscale(1) contrast(1.2) opacity(0.4)',
};

const center = {
    lat: -33.417329,
    lng: -70.565677,
};

const svgIcon = {
    fillColor: 'black',
}

const FeedbackSection: React.FC = () => {
    return (
        <section className="text-gray-600 body-font relative">
            <div className="absolute inset-0 bg-black">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={13} // Ajusta el nivel de zoom aquí
                    >
                        <Marker
                            position={center}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
            <div className="container px-5 py-24 mx-auto flex">
                <div className="lg:w-1/4 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md text-center">
                    <h2 className="text-gray-900 text-2xl mb-1 font-medium title-font uppercase main-title">Horarios</h2>
                    <p className="leading-relaxed mb-5 text-red-600 uppercase">
                        &apos;Ori Tahiti - Mujeres - Multinivel
                    </p>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600 main-title">Día</label>
                        <p className="leading-relaxed mb-5 text-gray-900 uppercase font-medium text-xl">
                            Todos los Viernes del mes
                        </p>
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600 main-title">Dirección</label>
                        <p className="leading-relaxed mb-5 text-gray-900 uppercase font-medium text-xl">
                            Av. Cristobal Colón 5363
                        </p>
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600 main-title">Horarios</label>
                        <ul>
                            <li className="font-medium text-xl text-gray-900">Clase 1: 19:00 hrs. a 20:30 hrs.</li>
                            <li className="font-medium text-xl text-gray-900">Clase 2: 20:30 hrs. a 22.00 hrs.</li>
                        </ul>
                    </div>
                    <button className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg main-title">
                        Más Info <span className="icon-[ph--whatsapp-logo-fill] text-2xl" />
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                        Chicharrones blog helvetica normcore iceland tousled brook viral artisan.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;

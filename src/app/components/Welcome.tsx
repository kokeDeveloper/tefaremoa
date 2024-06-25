const Welcome = () => {
    return (
        <section className="text-gray-600 bg-black body-font">
            <div className="container px-5 py-24 mx-auto">
                <h1 className="sm:text-4xl text-2xl title-font text-center text-white mb-20">
                    TE FARE MO'A
                    <br className="hidden sm:block" />Academia de danzas y cultura polinesia
                </h1>
                <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
                    {/* Bloque de bienvenida 1 */}
                    <div className="p-4 md:w-1/3 flex">
                        <div className="w-12 h-12 inline-flex items-center justify-center text-white mb-4 flex-shrink-0">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-9 h-9 icon-[map--florist]"
                                viewBox="0 0 24 24"
                            >
                            </svg>
                        </div>
                        <div className="flex-grow pl-6">
                            <h2 className="text-white text-lg title-font font-medium mb-2">Danza</h2>
                            <p className="leading-relaxed text-base">
                                Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.
                            </p>
                        </div>
                    </div>
                    {/* Bloque de bienvenida 2 */}
                    <div className="p-4 md:w-1/3 flex">
                        <div className="w-10 h-10 inline-flex items-center justify-center text-white mb-4 flex-shrink-0">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-10 h-10 icon-[ph--music-notes-fill]"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg> 
                        </div>
                        <div className="flex-grow pl-6">
                            <h2 className="text-white text-lg title-font font-medium mb-2">Música</h2>
                            <p className="leading-relaxed text-base">
                                Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.
                            </p>
                        </div>
                    </div>
                    {/* Bloque de bienvenida 3 */}
                    <div className="p-4 md:w-1/3 flex">
                        <div className="w-12 h-12 inline-flex items-center justify-center text-white flex-shrink-0">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-9 h-9 icon-[emojione-monotone--flag-for-french-polynesia] justify-center"
                                viewBox="0 0 24 24"
                            >
                            </svg>
                        </div>
                        <div className="flex-grow pl-6">
                            <h2 className="text-white text-lg title-font font-medium mb-2">Cultura</h2>
                            <p className="leading-relaxed text-base">
                                Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Welcome;
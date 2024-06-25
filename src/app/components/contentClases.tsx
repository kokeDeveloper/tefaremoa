import Image from "next/image"

export default function ContentClass() {
    return (
        <section className="text-gray-600 body-font bg-black">
            <div className="container px-5 py-24 mx-auto flex flex-wrap">
            <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="mb-4 text-white tracking-widest uppercase">Nuestras Clases</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably heard of them.</p>
                </div>
                <div className="flex w-full mb-20 flex-wrap text-white">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font  lg:w-1/3 lg:mb-0 mb-4 uppercase">Buscamos la excelencia sacando lo mejor de ti</h1>
                    <p className="lg:pl-6 lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably ard of them man bun deep jianbing selfies heirloom.</p>
                </div>
                <div className="flex w-full flex-wrap text-white">
                    <div className="lg:w-1/3 w-full mb-4 lg:mb-0">
                        <p className="leading-relaxed text-base">Consectetur do deserunt sint commodo commodo officia ut laborum culpa amet eu ex. Proident fugiat 
                        exercitation mollit irure qui laborum. Anim irure deserunt dolore officia minim laborum cupidatat occaecat non commodo nulla velit commodo. 
                        Laborum dolor veniam consequat irure pariatur ad. Ad veniam nulla laborum ad culpa incididunt in ex cupidatat laborum amet aute occaecat. Minim voluptate ex ad quis culpa occaecat culpa culpa officia.
                        </p>
                    </div>
                    <div className="lg:w-1/3 w-full mb-4 lg:mb-0">
                        <p className="leading-relaxed text-base">Veniam commodo esse non deserunt veniam. Dolor incididunt minim do ea Lorem dolore non eiusmod 
                        ullamco sunt elit. Ea consectetur labore incididunt sunt aliquip in irure labore anim dolor in. Enim tempor in laboris veniam do magna. 
                        Magna anim elit amet adipisicing ullamco occaecat anim excepteur esse aliquip nulla.2</p>
                    </div>
                    <div className="lg:w-1/3 w-full">
                        <Image
                            src="/henu.jpg"
                            alt="Descripción de la imagen"
                            width={500}
                            height={500}
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}



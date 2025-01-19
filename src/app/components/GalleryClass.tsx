import Image from 'next/image'
import React from 'react'

const data = [
    {
        id: 1,
        src: '/bnw_bt1.jpg',
        alt: 'gallery1'
    },
    {
        id: 2,
        src: '/bnw_bt2.jpg',
        alt: 'gallery2'
    },
    {
        id: 3,
        src: '/bnw_bt3.jpg',
        alt: 'gallery3'
    },
    {
        id: 4,
        src: '/bnw_bt4.jpg',
        alt: 'gallery4'
    },
    {
        id: 5,
        src: '/bnw_bt1.jpg',
        alt: 'gallery5'
    },
    {
        id: 6,
        src: '/bnw_bt2.jpg',
        alt: 'gallery6'
    },
    {
        id: 7,
        src: '/bnw_bt3.jpg',
        alt: 'gallery7'
    },
    {
        id: 8,
        src: '/bnw_bt4.jpg',
        alt: 'gallery8'
    },
]

const GalleryClass = () => {
    return (
        <>
            <section className="container flex w-full h-[700px] mx-auto my-0">
                {data.map((item) => (
                    <Image
                        key={item.id}
                        src={item.src}
                        alt={item.alt}
                        width={700}
                        height={700}
                        className="
                            w-0 
                            flex-grow 
                            object-cover 
                            opacity-80 
                            transition-all
                            duration-5000 
                            ease-in-out
                            hover:z-50
                            hover:cursor-crosshair 
                            hover:w-[25%]
                            hover:h-[100%]
                            hover:opacity-100 
                            hover:filter-contrast-120"
                    />
                ))}
            </section>
        </>
    )
}

export default GalleryClass
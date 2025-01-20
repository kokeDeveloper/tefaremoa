import React from 'react'
import { PF, FR, MX } from 'country-flag-icons/react/3x2'
import Image from 'next/image'

const flagComponents = {
    PF: PF,
    FR: FR,
    MX: MX
}

type FlagKey = keyof typeof flagComponents;

const data: { title: string; date: string; flag: FlagKey; img: string; text: string }[] = [
    {
        title: 'Moon Tahiti',
        date: 'diciembre 2024',
        flag: 'PF',
        img: '/bnw_bt4.jpg',
        text: 'Commodo aute nisi et eiusmod ipsum commodo labore aliqua cupidatat anim. Consequat dolor sunt ut in occaecat proident ut minim aliquip. Lorem nulla aliquip incididunt ipsum. Sint fugiat veniam tempor nostrud dolor. Ex excepteur et dolore esse do esse ipsum ad fugiat nostrud. Veniam consectetur aliquip deserunt excepteur nostrud.'
    },
    {
        title: 'Ranitea Laughlin',
        date: 'diciembre 2024',
        flag: 'PF',
        img: '/bnw_bt4.jpg',
        text: 'Commodo aute nisi et eiusmod ipsum commodo labore aliqua cupidatat anim. Consequat dolor sunt ut in occaecat proident ut minim aliquip. Lorem nulla aliquip incididunt ipsum. Sint fugiat veniam tempor nostrud dolor. Ex excepteur et dolore esse do esse ipsum ad fugiat nostrud. Veniam consectetur aliquip deserunt excepteur nostrud.'
    },
    {
        title: 'Lili Tanematea',
        date: 'diciembre 2024',
        flag: 'MX',
        img: '/bnw_bt4.jpg',
        text: 'Commodo aute nisi et eiusmod ipsum commodo labore aliqua cupidatat anim. Consequat dolor sunt ut in occaecat proident ut minim aliquip. Lorem nulla aliquip incididunt ipsum. Sint fugiat veniam tempor nostrud dolor. Ex excepteur et dolore esse do esse ipsum ad fugiat nostrud. Veniam consectetur aliquip deserunt excepteur nostrud.'
    },
    {
        title: 'Mareva Boucheaux',
        date: 'diciembre 2024',
        flag: 'PF',
        img: '/bnw_bt4.jpg',
        text: 'Commodo aute nisi et eiusmod ipsum commodo labore aliqua cupidatat anim. Consequat dolor sunt ut in occaecat proident ut minim aliquip. Lorem nulla aliquip incididunt ipsum. Sint fugiat veniam tempor nostrud dolor. Ex excepteur et dolore esse do esse ipsum ad fugiat nostrud. Veniam consectetur aliquip deserunt excepteur nostrud.'
    },
    {
        title: 'Magnifique Polinesie',
        date: 'diciembre 2024',
        flag: 'MX',
        img: '/bnw_bt4.jpg',
        text: 'Commodo aute nisi et eiusmod ipsum commodo labore aliqua cupidatat anim. Consequat dolor sunt ut in occaecat proident ut minim aliquip. Lorem nulla aliquip incididunt ipsum. Sint fugiat veniam tempor nostrud dolor. Ex excepteur et dolore esse do esse ipsum ad fugiat nostrud. Veniam consectetur aliquip deserunt excepteur nostrud.'
    }

]

const WorkshopModule = () => {
    return (
        <section className='container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto my-0'>
            {data.map((item, index) => {
                const FlagComponent = flagComponents[item.flag]
                return (
                    <div key={index} className='flex flex-col items-center space-y-2 mb-14'>
                        <div className='flex items-center space-x-2'>
                            <FlagComponent title={item.flag} className='w-10 h-10' />
                            <h2 className='text-4xl'>{item.title}</h2>
                        </div>
                        <h3 className='text-lg text-gray-500'>{item.date}</h3>
                        <div className='relative'>
                            <Image src={item.img} alt='workshop' width={300} height={200} className='rounded-md' />
                        </div>
                        <p className='text-center px-10'>{item.text}</p>
                    </div>
                )
            })}
        </section>
    )
}

export default WorkshopModule
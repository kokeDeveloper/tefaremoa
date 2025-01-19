import Image from 'next/image';
import * as React from 'react';

const timelineData = [
  {
    title: 'Fundación de la Academia',
    date: '01/01/2000',
    image: '/bnw_bt1.jpg',
    description: 'La academia fue fundada con el objetivo de promover la educación y el desarrollo personal.'
  },
  {
    title: 'Primer Evento Importante',
    date: '15/05/2005',
    image: '/bnw_bt2.jpg',
    description: 'Se llevó a cabo el primer evento importante que marcó un hito en la historia de la academia.'
  },
  {
    title: 'Expansión Internacional',
    date: '10/10/2010',
    image: '/bnw_bt3.jpg',
    description: 'La academia expandió sus horizontes y comenzó a operar a nivel internacional.'
  },
  // ...otros hitos...
];

export default function TimeLineTeFare() {
  return (
    <>
      <div className='text-center text-4xl'>
        <h2>Nuestra historia</h2>
      </div>
      <div className='py-10 flex flex-col md:flex-row md:flex-wrap md:justify-center'>
        {timelineData.map((item, index) => (
          <div key={index} className='mb-8 flex flex-col items-center md:w-1/3'>
            <Image src={item.image} alt={item.title} width={128} height={128} className='rounded-full mb-4' />
            <h3 className='text-2xl font-bold'>{item.title}</h3>
            <p className='text-gray-600'>{item.date}</p>
            <p className='text-center max-w-xl'>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

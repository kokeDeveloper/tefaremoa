import Image from 'next/image';
import * as React from 'react';

const timelineData = [
  {
    title: 'Fundación de Te Fare Mo\'a',
    date: 'enero 2017',
    image: '/misalumnas2017.jpg',
   
  },
  {
    title: '1er Flashmob \'Ori Tahiti, Santiago de Chile ',
    date: 'abril 2018',
    image: '/flashmob2018.jpg',

  },
  {
    title: 'Workshop Yutzil Duque (México)',
    date: ' agosto 2018',
    image: '/jutzilduque.jpg',

  },
  {
    title: 'Workshop Claudio Huesca (México)',
    date: 'agosto 2018',
    image: '/claudiohuesca.jpg',
  },
  {
    title: 'Workshop María José Román (México)',
    date: 'noviembre 2018',
    image: '/mjRoman.jpg',
  },
  {
    title: '2do Flashmob \'Ori Tahiti, Santiago de Chile ',
    date: 'mayo 2019',
    image: '/flashmob2019.jpg',
  },
  {
    title: 'Workshop Mareva Boucheaux (Frencia-Tahiti)',
    date: 'agosto 2019',
    image: '/mareva 2019.jpeg',
  },
  {
    title: '1era gala de Te fare mo\'a',
    date: 'mayo 2019',
    image: '/gala2019.PNG',
  },
  {
    title: 'Workshop Lili Tanematea (México-Tahiti)',
    date: 'noviembre 2018',
    image: '/LILI.jpeg',
  },
  {
    title: '3er Flashmob Online \'Ori Tahiti',
    date: 'mayo 2020',
    image: '/flashmob2020.png',
  },
  {
    title: '2° lugar solista profesional Heiva',
    date: '\'Ori Tahiti Virtual Solo Competition 2020',
    image: '/HeivaVirtual2020.JPG',
  },
  {
    title: 'Gala online “Haere mai i te heiva”',
    date: '\'Febrero 2021',
    image: '/galaonline.jpg',
  },
  {
    title: '2° lugar solista categoría profesional',
    date: 'E Ua No Fetia Online 2021',
    image: '/euanofetia.jpg',
  },
  {
    title: '3° lugar solista categoría maestra',
    date: 'Te Varua o Te \'Ori Online 2021 ',
    image: '/tevaruaori2021.jpg',
  },
  {
    title: '1° lugar orquesta creación',
    date: 'Te Varua o Te \'Ori Online 2021 ',
    image: '/orquesta2021.jpg',
  },
  {
    title: '1° lugar solista categoría profesional 35 +',
    date: 'Heiva I San Diego Online 2021',
    image: '/heivasandiego.jpg',
  },
  {
    title: '1° lugar categoría Mehura',
    date: '\'Aito International Competition Online 2022 ',
    image: '/mehura2022.jpg',
  },
  {
    title: 'Workshop Ranitea Laughlin',
    date: 'mayo 2024 ',
    image: '/ranitea.jpg',
  },
  {
    title: 'Workshop Moon Tahiti',
    date: 'diciemnbre 2024 ',
    image: '/moonWS-2024.jpg',
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
            <Image src={item.image} alt={item.title} width={300} height={300} className='rounded-lg mb-4' />
            <h3 className='text-2xl font-bold'>{item.title}</h3>
            <p className='text-gray-600'>{item.date}</p>

          </div>
        ))}
      </div>
    </>
  );
}

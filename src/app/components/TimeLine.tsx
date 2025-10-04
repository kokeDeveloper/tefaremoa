import Image from 'next/image';
import React from 'react';
import { Timeline } from './timelineTFM'

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


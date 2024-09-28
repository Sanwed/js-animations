import Gallery from './gallery/gallery';
import Flight from './flight/flight';

const animations = [
  {
    name: 'Gallery',
    subtitle: 'GSAP',
    animation: Gallery,
    image: './assets/images/gallery-preview',
  },
  {
    name: 'Flight 3D',
    subtitle: 'Three.js',
    animation: Flight,
    image: './assets/images/flight-preview',
  }
];

export default animations;

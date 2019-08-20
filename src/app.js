import leaflet from 'leaflet';
import map from './js/map';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/leaflet.css';
import './scss/main.scss';

document.addEventListener("DOMContentLoaded", () => {
  map();
});
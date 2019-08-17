import leaflet from 'leaflet';
import map from './js/map';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import './scss/main.scss';
import 'leaflet/dist/leaflet.css';

document.addEventListener("DOMContentLoaded", () => {
  map();
});
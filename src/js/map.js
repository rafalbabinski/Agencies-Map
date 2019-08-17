import regions from './regions';

const map = () => {
  let cityName,places,polygon,regionName;

  let regionSelect = document.querySelector('#region');
  let citySelect = document.querySelector('#city');
  let agencies = document.querySelector('.agencies');
  let agenciesList = document.querySelector('.agencies__list');

  // Zoom level to fit whole country/city on mobile
  let zoomCountry = (window.innerWidth < 1000 ) ? ((window.innerWidth - 320)*0.002352941) + 5.2 : 6.5;
  let zoomCity = (window.innerWidth < 1000 ) ? 2 : 0;

  let map = L.map('map__box--1').setView([52.0688122, 19.4797444], zoomCountry);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 6,
    maxZoom: 18,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a',
		id: 'mapbox.streets'
	}).addTo(map);

  fetch('https://api.myjson.com/bins/j24qq')
  .then(data => data.json())
  .then(data => {
		places = data;
		
		Object.keys(places).forEach(prop => {
			let cities = places[prop].cities;
			let prevProp = prop;
			
			Object.keys(cities).forEach(prop => {
				if (places[prevProp].cities[prop].places) {

					places[prevProp].cities[prop].places.forEach(place => {
						let infoPopup = `
						<div class='info'>
							<p class='info__name'>${place.name}</p>
							<p class='info__adress'>${place.adress}</p>
							<p class="info__phone">${place.phone.join(', ')}</p>
						</div>`;

            L.marker([place.location[0], place.location[1]]).bindPopup(infoPopup).on('click', markerOnClick).addTo(map);
					});
				}
			});
		});
  }).catch((error) => {
    console.log(error)
  });

  const markerOnClick = e => {
    let latLngs = [e.target.getLatLng()];
    let markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
  }
  
  regionSelect.addEventListener('change', function() {
    let points = [];
    let region = regions[this.value];
    regionName = this.value;

    // Find cities
    // Clear
    citySelect.innerHTML = '<option value="">- wybierz miasto -</option>';

    // New choose
    let cities = places[regionName].cities;
    Object.keys(cities).map(city => {
      citySelect.innerHTML += `<option value='${city}'>${city}</option>`;
    })

    // Build border polygon for region
    for (let i = 0; i < region.length; i += 2) {
      points.push([region[i + 1], region[i]]);
    }

    if (polygon) {map.removeLayer(polygon);}
    polygon = L.polygon(points, {color: 'red'}).addTo(map);
    map.fitBounds(polygon.getBounds());
	});
	
  // Select city
  citySelect.addEventListener('change', function() {
    if (!agencies.classList.contains('active')) {
      agencies.classList.add('active');
    }

    cityName = this.value;
    let currCity = places[regionName].cities[cityName];
    map.setView([currCity.location[0],currCity.location[1]],currCity.zoom - zoomCity);

    agenciesList.innerHTML = '';
    currCity.places.forEach(item => {
      let agency = `
        <div class="agencies__item">
          <p class="agencies__name">${item.name}</p>
          <p class="agencies__adress">${item.adress}</p>
          <div class="agencies__phone-box">
            ${item.phone.map(item => `<p class="agencies__phone">${item}</p>`).join('')}
          </div>
        </div>`;
      
      agenciesList.innerHTML += agency;
    });
  });
}

export default map;
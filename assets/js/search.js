const searchData = JSON.parse(window.localStorage.getItem('search_data'))
const apiData = JSON.parse(window.localStorage.getItem('airbnb_data'))

document.getElementById('search').value = searchData.search;
document.getElementById('date').value = searchData.date;
document.getElementById('guest').value = searchData.guest + ' guests';

let locations = [];

const addDataIntoHTMl = () => {
    const cardContainer = document.getElementById('container');

    apiData.forEach((result, index) => {
        const data = `
            <div class="left" style="position: relative;">
                <div class="distance"></div>
                <img src="${result.images[0]}" alt="${result.name}">
            </div>
            <div class="card-right">
                <div>
                    <div class="top">
                        <p>${result.type}</p>
                        <button type="button" class="btn">
                            <svg width="20" height="20" viewBox="0 0 22 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M10.9934 3.64436C9.06065 1.48008 5.83773 0.897898 3.41618 2.87972C0.994636 4.86155 0.653715 8.17507 2.55537 10.519L10.9934 18.3334L19.4313 10.519C21.333 8.17507 21.0337 4.8407 18.5705 2.87972C16.1074 0.918745 12.9261 1.48008 10.9934 3.64436Z"
                                    stroke="#374151" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                    
                    <h2>${result.name}</h2>
                </div>
                <p class="about">
                    <span>${result.persons} guests</span> .
                    <span>${result.type}</span> .
                    <span>${result.beds} beds</span> .
                    <span>${result.bathrooms} bath</span> .
                    ${result.previewAmenities.reduce((p, c) => {
            return p + `<span>${c}</span> .`
        }, '')}
                </p>

                <div class="bottom">
                    <p>
                        <strong>${((result.rating || '') + '').slice(0, 3)}</strong>
                    <img src="./assets/images/star.png" alt="reviews">
                    <span>(${result.reviewsCount} reviews)</span>
                    </p>
                    <span><b>${result.price.priceItems[0].title.split(' x ')[0]}</b> /night</span>
                </div>
            </div>
        `

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = data;

        locations.push([result.name, result.lat, result.lng]);

        card.onclick = () => {
            localStorage.setItem('airbnb_room_index', index);
            window.location.href = './single.html'
        }

        cardContainer.appendChild(card);
    })
}

addDataIntoHTMl()

const map = L.map('map').setView([locations[0][1], locations[0][2]], 8);
const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
}).addTo(map);

for (var i = 0; i < locations.length; i++) {
    marker = new L.marker([locations[i][1], locations[i][2]])
        .bindPopup(locations[i][0])
        .addTo(map);
}

const getDistance = (source, destination) => {
    // return distance in meters
    var lon1 = toRadian(source[1]),
        lat1 = toRadian(source[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return Math.round(c * EARTH_RADIUS * 1000);
}

const toRadian = (degree) => {
    return degree * Math.PI / 180;
}

const setDistance = () => {
    let i = 0;
    document.querySelectorAll('.distance').forEach((ele) => {
        var distance = getDistance([userLoc.latitude, userLoc.longitude], [locations[i][1], locations[i][2]]);
        ele.innerText = `Distance from you : ${distance} km`;
        i++;
    })
}

let userLoc = {};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        userLoc.latitude = position.coords.latitude;
        userLoc.longitude = position.coords.longitude;
        setDistance();
    });
} else {
    console.log('no-geolocation');
}
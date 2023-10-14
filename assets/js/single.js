const index = window.localStorage.getItem('airbnb_room_index') || 0
const result = JSON.parse(window.localStorage.getItem('airbnb_data'))[index]
const search = JSON.parse(window.localStorage.getItem('search_data'))

console.log(result)


var map = L.map('map').setView([result.lat, result.lng], 13);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
}).addTo(map);


// Creating a Layer object
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);         // Adding layer to the map
var marker = L.marker([result.lat, result.lng]);    // Creating a Marker

// Adding popup to the marker
marker.bindPopup('You will be exactly here').openPopup().addTo(map);
marker.addTo(map); // Adding marker to the map

/** 
 * Header */


document.getElementById('title-h2').innerHTML = `
    <h2>${result.name}</h2>
    <p>
        <span>${result.persons} Guests</span>
        <span>.</span>
        <span>${result.bedrooms} bedroom</span>
        <span>.</span>
        <span>${result.beds} bed</span>
        <span>.</span>
        <span>${result.bathrooms}  bath</span>
    </p>`;

document.getElementById('title').textContent = result.name;
document.getElementById('review').textContent = ((result.rating || '') + '').slice(0, 3)
document.getElementById('reviewCount').textContent = result.reviewsCount + ' reviews'
document.getElementById('hosttype').textContent = result.type
if (result.isSuperhost) {
    document.getElementById('superhost').innerHTML = `<img src="./assets/images/badge.png" alt="icon">
                        Supderhost`
}

document.getElementById('image').innerHTML = `
    <div class="left">
        <img src="${result.images[0]}" alt="Place">
    </div>
    <div class="right" style="width:45%">
        <img src="${result.images[1]}" alt="Place">
        <img src="${result.images[2]}" alt="Place">
        <img src="${result.images[3]}" alt="Place">
        <img src="${result.images[4]}" alt="Place">
    </div>
`

document.getElementById('sleep').innerHTML = `
    <h2>Where you'll sleep</h2>
    <div class="info">
        <img src="${result.images[0]}" alt="">
        <b>${result.bedrooms} Bedroom</b>
        <span>${result.beds} queen bed</span>
    </div>
`


document.getElementById('price').innerHTML = `
    <div class="top">
        <span><b>${result.price.priceItems[0].title.split(' x ')[0]}</b>/night</span>
        <span>
            <img src="./assets/images/redstar.png" alt="">
            <span>${result.reviewsCount} reviews</span>
        </span>
    </div>

    <div class="checkout">
        <div class="t">
            <div class="box">
                <b>Check-in</b><br>
                <span>${search.checkin}</span>
            </div>
            <div class="box">
                <b>Check-out</b><br>
                <span>${search.checkout}</span>
            </div>
        </div>
        <div class="box">
            <b>Guests</b>
            <span>${search.guest} guest</span>
        </div>
    </div>

    <button type="button" class="btn">
        Restore
    </button>
    <p>You won't be charged yet</p>

    <ul>
    
        ${result.price.priceItems.reduce((p, c) => {
    return p + `<li>
            <span>${c.title}</span>
            <span>${c.amount} ${result.price.currency}</span>
        </li>`
}, '')}
        <li>
            <span>Total</span>
            <span>${result.price.total} ${result.price.currency}</span>
        </li>
    </ul>
`

function showBookingCostBreakdown(listing) {
    // Calculate additional fees and total cost
    const additionalFees = listing.price * 0.10; // Assuming additional fees are 10% of base price
    const totalCost = listing.price + additionalFees;

    // Create a modal dialog box
    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    // Add booking cost breakdown to the modal
    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

    // Add a close button to the modal
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    // Add the modal to the body
    document.body.appendChild(modal);
}

async function getRoomDetails() {
    const url = `https://airbnb19.p.rapidapi.com/api/v1/getPropertyDetails?propertyId=${result.id}&currency=INR`;

    try {
        const response = await fetch(url, API_KEYS);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }

}

// getRoomDetails();

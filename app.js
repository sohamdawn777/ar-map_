window.addEventListener("DOMContentLoaded",() => {

let LiveLat;
let LiveLong;

function log(msg) {
  const logBox = document.getElementById("log") || (() => {
    const div = document.createElement("div");
    div.id = "log";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.background = "white";
    div.style.padding = "10px";
    div.style.zIndex = "9999";
    document.body.appendChild(div);
    return div;
  })();
  logBox.innerHTML += `<div>${msg}</div>`;
}

function liveLoc(position) {
const liveLat= position.coords.latitude;
const liveLng= position.coords.longitude;

L.marker([liveLat, liveLng], {icon: L.icon({iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Your Location", draggable: false, riseOnHover: true }).addTo(map);

LiveLat= liveLat;
LiveLong= liveLng;
}

function errFetch(error) {
log(`An error occured: ${error.message}`);
}

function mapMarker (data) {
for (let j of data) {
const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true }).addTo(map);

marker.bindPopup(`<h3>${j.place}</h3>
  <p>Want to know more about this place?<br>
  <a href="${j.link}" target="_blank">Click here</a></p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (LiveLat && LiveLong) {
marker.on("popupopen", () => {
routingControl.setWaypoints{[L.latLng(LiveLat, LiveLong), L.latLng(j.lat, j.lon)]};
});
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);
}

const map= L.map("map", { center: [22.526911,88.377648], zoom: 19, maxZoom: 19, minZoom: 1 });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19, minZoom: 1, tms: false }).addTo(map);

let data= [{lat: 22.526911, lon: 88.377648, place: "Nabin Pally", link: "https://q.me-qr.com/7ErN213N"}, {lat: 22.5999666, lon: 88.3729349, place: "Bidhan Sarani", link: "https://qr1.me-qr.com/text/t49MjMpL"}, {lat: 22.56492395, lon: 88.35405545738757, place: "Lenin Sarani", link: "https://qr1.me-qr.com/text/mhpVXPZ1"}];

const fetchBtn= document.createElement("button");
fetchBtn.textContent = "Share your location";
fetchBtn.style.position = "fixed";
fetchBtn.style.top = "20px";
fetchBtn.style.left = "50%";
fetchBtn.style.transform = "translateX(-50%)";
fetchBtn.style.zIndex = 9999;
document.body.appendChild(fetchBtn);

fetchBtn.addEventListener("click", () => {
navigator.geolocation.getCurrentPosition(liveLoc, errFetch);
document.body.removeChild(fetchBtn);
});

const routingControl= L.Routing.control({waypoints: [], router: L.Routing.mapbox("pk.eyJ1Ijoic2QxMjM0NS0iLCJhIjoiY21mNW1jNHoyMDZscDJrc2l1Z3VsaTBmNSJ9.7V5XHO7ewmSQtHOTka6rlg")}).addTo(map);

mapMarker(data);

});

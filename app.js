window.addEventListener("DOMContentLoaded",() => {

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

function mapMarker (data) {
for (let j of data) {
const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<h3>${j.place}</h3>
  <p>Want to know more about this place?<br>
  <a href="${j.link}" target="_blank">Click here</a></p>
`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);
}

const map= L.map("map", { center: [22.526911,88.377648], zoom: 19, maxZoom: 19, minZoom: 1 });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19, minZoom: 1, tms: false }).addTo(map);

let data= [{lat: 22.526911, lon: 88.377648, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model1.glb", place: "Nabin Pally", link: "https://q.me-qr.com/7ErN213N"}, {lat: 22.5999666, lon: 88.3729349, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model2.glb", place: "Bidhan Sarani", link: "https://qr1.me-qr.com/text/t49MjMpL"}, {lat: 22.56492395, lon: 88.35405545738757, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model3.glb", place: "Lenin Sarani", link: "https://qr1.me-qr.com/text/mhpVXPZ1"}];

mapMarker(data);

});

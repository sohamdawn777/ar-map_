window.addEventListener("DOMContentLoaded", () => {

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

  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  }

  function mapMarker(data, map, lati, longi, routingControl) {
    for (let j of data) {
      const marker = L.marker([j.lat, j.lon], {
        icon: L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        }),
        title: "Graffiti Spot",
        draggable: false,
        riseOnHover: true,
      }).addTo(map);

      marker.bindPopup(
        `<h3>${j.place}</h3>
        <p>Want to know more about this place?<br>
        <a href="${j.link}" target="_blank">Click here</a></p>`,
        { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true }
      );

      marker.on("popupopen", () => {
        routingControl.setWaypoints([
          L.latLng(lati, longi),
          L.latLng(j.lat, j.lon),
        ]);
      });
    }

    const bounds = L.latLngBounds(data.map((j) => [j.lat, j.lon]));
    map.fitBounds(bounds);
  }

  const fetchBtn = document.createElement("button");
  fetchBtn.textContent = "Share your location";
  fetchBtn.style.position = "fixed";
  fetchBtn.style.top = "20px";
  fetchBtn.style.left = "50%";
  fetchBtn.style.transform = "translateX(-50%)";
  fetchBtn.style.zIndex = 9999;
  document.body.appendChild(fetchBtn);

  fetchBtn.addEventListener("click", async () => {
    try {
      const coordinates = await getLocation();
      document.body.removeChild(fetchBtn);

      const map = L.map("map", {
        center: [coordinates.coords.latitude, coordinates.coords.longitude],
        zoom: 19,
        maxZoom: 19,
        minZoom: 1,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        minZoom: 1,
        tms: false,
      }).addTo(map);

      const routingControl = L.Routing.control({
        waypoints: [],
        router: L.Routing.mapbox("pk.eyJ1Ijoic2QxMjM0NS0iLCJhIjoiY21mNW1jNHoyMDZscDJrc2l1Z3VsaTBmNSJ9.7V5XHO7ewmSQtHOTka6rlg"),
      }).addTo(map);

      let data = [
        { lat: 22.526911, lon: 88.377648, place: "Nabin Pally", link: "https://q.me-qr.com/7ErN213N" },
        { lat: 22.5999666, lon: 88.3729349, place: "Bidhan Sarani", link: "https://qr1.me-qr.com/text/t49MjMpL" },
        { lat: 22.56492395, lon: 88.35405545738757, place: "Lenin Sarani", link: "https://sohamdawn777.github.io/ar_map-/LeninSarani.html" },
      ];

      mapMarker(data, map, coordinates.coords.latitude, coordinates.coords.longitude, routingControl);
    } catch (e) {
      log(e);
    }
  });
});
const map= L.map("map", { center: [22.526911,88.377648], zoom: 15, maxZoom: 19, minZoom: 1 });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19, minZoom: 1, tms: false }).addTo(map);

let data= [{lat: 22.526911, lon: 88.377648, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model1.glb"}, {lat: 22.5999666, lon: 88.3729349, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model2.glb"}, {lat: 22.56492395, lon: 88.35405545738757, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model3.glb"}];
const scene= new THREE.Scene();


const camera= new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
scene.add(camera);

const ambLight= new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

const dirLight= new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const renderer= new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);

renderer.xr.enabled= true;

const glbLoader= new THREE.GLTFLoader();

const arBtn= THREE.ARButton.createButton(renderer);
arBtn.id="AR";
arBtn.style.position= "fixed";
arBtn.style.bottom= "20px";
arBtn.style.right= "20px";
arBtn.style.zIndex= 9999;
arBtn.style.visibility= "hidden";
document.body.appendChild(arBtn);
//arBtn.addEventListener("click", modelLoad);

//renderer.xr.addEventListener("sessionstart", setupXR);

let currentMarker= null;

for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "Icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (arBtn) {
marker.on("popupopen", () => {
document.querySelector("#AR").style.visibility= "visible";
currentMarker= marker;
});
}
}
let text = document.createElement("div");
text.innerText = ""; // initial text, can update later
text.id = "ar-message"; // optional, for styling or easy access
text.style.position = "fixed";
text.style.top = "20px";
text.style.left = "50%";
text.style.transform = "translateX(-50%)";
text.style.background = "rgba(0,0,0,0.6)";
text.style.color = "white";
text.style.padding = "8px 12px";
text.style.borderRadius = "8px";
text.style.fontFamily = "sans-serif";
text.style.zIndex = 9999;
document.body.appendChild(text);
});

window.addEventListener("DOMContentLoaded",() => {

let loadedModel;

function log(msg) {
  const logBox = document.getElementById("log") || (() => {
    const div = document.createElement("div");
    div.id = "log";
    div.style.position = "fixed";
    div.style.bottom = "0";
    div.style.left = "0";
    div.style.background = "white";
    div.style.padding = "10px";
    div.style.zIndex = "9999";
    document.body.appendChild(div);
    return div;
  })();
  logBox.innerHTML += `<div>${msg}</div>`;
}

function onLoad(gltf) {

log("model loaded");

document.getElementById("loader-element").style.visibility= "hidden";
document.getElementById("progress-bar").style.visibility= "hidden";

//gltf.scene.position.set(0,0,0);
gltf.scene.scale.set(1,1,1);
//scene.add(gltf.scene);
loadedModel= gltf;

}

function onProgress(xhr) {

log("model loading on progress");

let progressBar= document.getElementById("progress-bar");
progressBar.style.width= ((xhr.loaded/xhr.total)*100).toFixed(2) + "%";

}

function onError(error) {

log("error is coming");

let err= document.getElementById("error");
err.innerHTML=`An Error Occurred: ${error}.`;

}

function modelLoad() {

log("model loading initiated");

glbLoader.load(currentMarker.options.modelUrl, onLoad, onProgress, onError);

}

function mapMarker (btn, data) {

for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (btn) {
log("called");
marker.on("popupopen", () => {
fallBtn.style.visibility= "visible";
currentMarker= marker;
});
}
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);

}

async function setupXR(event) {

const xrSession= await navigator.xr.requestSession("immersive-ar",{requiredFeatures: ["hit-test"] });

log("session requested");

modelLoad();

renderer.domElement.style.display= "block";
renderer.domElement.style.zIndex= "10000";

//const xrSession= renderer.xr.getSession();
const space= await xrSession.requestReferenceSpace("local-floor");
const viewerSpace= await xrSession.requestReferenceSpace("viewer");
const source= await xrSession.requestHitTestSource({space: viewerSpace });

renderer.setAnimationLoop(() => {
renderer.render(scene, camera);
});

let anchorStatus= false;
xrSession.addEventListener("select", (xrFrame) => {
try {
const result= xrFrame.getHitTestResults(source);
if (result.length>0 && anchorStatus=== false) {
const pose= result[0].getPose(space);

xrSession.addAnchor(pose, space);

if (loadedModel && loadedModel.scene) {
const position= pose.transform.position;
loadedModel.scene.position.set(position.x, position.y, position.z);
scene.add(loadedModel.scene);
anchorStatus= true;
}

else {
log("model not loaded yet");
}
}
else {
}
}
catch {
log("Invalid surface chosen");
}
});
xrSession.addEventListener("end",() => {
if (arMessage && arMessage.parentNode) {
document.body.removeChild(arMessage);
}
anchorStatus= false;
if (loadedModel && loadedModel.scene && scene.children.includes(loadedModel.scene)) {
scene.remove(loadedModel.scene);
}
renderer.domElement.style.display= "none";
renderer.domElement.style.zIndex= "0";
});
}


const map= L.map("map", { center: [22.526911,88.377648], zoom: 19, maxZoom: 19, minZoom: 1 });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19, minZoom: 1, tms: false }).addTo(map);

let data= [{lat: 22.526911, lon: 88.377648, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model1.glb"}, {lat: 22.5999666, lon: 88.3729349, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model2.glb"}, {lat: 22.56492395, lon: 88.35405545738757, model: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/model3.glb"}];

const scene= new THREE.Scene();

const camera= new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10);

const ambLight= new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

const dirLight= new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const renderer= new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.display = "none";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";
renderer.domElement.style.border = "2px solid red";
document.body.appendChild(renderer.domElement);

renderer.xr.enabled= true;

const glbLoader= new THREE.GLTFLoader();

let arBtn;
let fallBtn;
let currentMarker= null;

if (navigator.xr) {
log("true");
navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
if (supported) {
log(`supported: ${supported}`);
arBtn= document.createElement("button");
arBtn.id="AR";
arBtn.style.position= "fixed";
arBtn.style.bottom= "20px";
arBtn.style.right= "20px";
arBtn.style.zIndex= 9999;
arBtn.style.visibility= "hidden";
document.body.appendChild(arBtn);
arBtn.addEventListener("click", setupXR);

/*for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (arBtn) {
marker.on("popupopen", () => {
arBtn.style.visibility= "visible";
currentMarker= marker;
});
}
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);*/

mapMarker(arBtn, data);
}
else {
log("immersive ar not supported");
fallBtn= document.createElement("button");
fallBtn.id="fall";
fallBtn.innerText="View in AR";
fallBtn.style.position= "fixed";
fallBtn.style.bottom= "20px";
fallBtn.style.right= "20px";
fallBtn.style.zIndex= 9999;
fallBtn.style.visibility= "hidden";
document.body.appendChild(fallBtn);
log("fallBtn added");
fallBtn.addEventListener("click", () => {
log("model loading INITIATED");

glbLoader.load(currentMarker.options.modelUrl, onLoad, onProgress, onError);
if (loadedModel && loadedModel.scene) {
camera.position.set(0, 1.6, 3);

scene.add(loadedModel.scene);

renderer.domElement.style.display= "block";
renderer.domElement.style.zIndex= "10000";
renderer.setAnimationLoop(() => {
renderer.render(scene, camera);
});
}
});

/*for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (fallBtn) {
log("called");
marker.on("popupopen", () => {
fallBtn.style.visibility= "visible";
currentMarker= marker;
});
}
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);*/

mapMarker(fallBtn, data);
log("event added");
}
});
}
});

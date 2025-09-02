window.addEventListener("DOMContentLoaded",() => {

let loadedModel;

function onLoad(gltf) {

document.getElementById("loader-element").style.visibility= "hidden";
document.getElementById("progress-bar").style.visibility= "hidden";

//gltf.scene.position.set(0,0,0);
gltf.scene.scale.set(1,1,1);
//scene.add(gltf.scene);
loadedModel= gltf;

}

function onProgress(xhr) {

let progressBar= document.getElementById("progress-bar");
progressBar.style.width= ((xhr.loaded/xhr.total)*100).toFixed(2) + "%";

}

function onError(error) {

let err= document.getElementById("error");
err.innerHTML=`An Error Occurred: ${error}.`;

}

function modelLoad(event) {

glbLoader.load(currentMarker.options.modelUrl, onLoad, onProgress, onError);

}

async function setupXR(event) {

const arMessage = document.createElement("div");
arMessage.id = "ar-message";
arMessage.textContent = "Tap on a valid surface (e.g: Table, Chair etc.).";
arMessage.style.position = "fixed";
arMessage.style.top = "20px";
arMessage.style.left = "50%";
arMessage.style.transform = "translateX(-50%)";
arMessage.style.background = "rgba(0,0,0,0.6)";
arMessage.style.color = "white";
arMessage.style.padding = "8px 12px";
arMessage.style.borderRadius = "8px";
arMessage.style.fontFamily = "sans-serif";
arMessage.style.zIndex = 9999;
document.body.appendChild(arMessage);

const xrSession= renderer.xr.getSession();
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
anchorStatus= true;

arMessage.textContent= "Experience AR!";
setTimeout(() => {
arMessage.textContent="";}, 3000);
}

else {
arMessage.textContent= "Model not loaded yet";
setTimeout(() => {
arMessage.textContent= "Tap on a valid surface (e.g: Table, Chair etc.).";
}, 3000);
}
}
else {
}
}
catch {
arMessage.textContent= "Invalid surface chosen. Please select a valid surface.";
setTimeout(() => {
arMessage.textContent= "Tap on a valid surface (e.g: Table, Chair etc.).";}, 3000);
}
});
xrSession.addEventListener("end",() => {

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

if (navigator.xr && navigator.xr.isSessionSupported) {
const arBtn= ARButton.createButton(renderer);
arBtn.id="AR";
arBtn.style.position= "fixed";
arBtn.style.bottom= "20px";
arBtn.style.right= "20px";
arBtn.style.zIndex= 9999;
arBtn.style.visibility= "hidden";
document.body.appendChild(arBtn);
arBtn.addEventListener("click", modelLoad);
}

else {
const fallBtn= document.createElement("button");
fallBtn.id="fall";
fallBtn.innerText="View in AR";
fallBtn.style.position= "fixed";
fallBtn.style.bottom= "20px";
fallBtn.style.right= "20px";
fallBtn.style.zIndex= 9999;
fallBtn.style.visibility= "hidden";
document.body.appendChild(fallBtn);
fallBtn.addEventListener("click", modelLoad);
}

renderer.xr.addEventListener("sessionstart", setupXR);

let currentMarker= null;

for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://raw.githubusercontent.com/sohamdawn777/Ar-map/main/Icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

  L.circle([j.lat,j.lon], { radius: 15, color: "black", fillColor: "blue", fillOpacity: 0.2 }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (arBtn) {
marker.on("popupopen", () => {
document.querySelector("#AR").style.visibility= "visible";
currentMarker= marker;
});
}
else if (fallBtn) {
marker.on("popupopen", () => {
document.querySelector("#fall").style.visibility= "visible";
currentMarker= marker;
});
}
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);
});

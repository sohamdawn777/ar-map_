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

function onLoad(gltf) {

//document.getElementById("loader-element").style.visibility= "hidden";
//document.getElementById("progress-bar").style.visibility= "hidden";

//gltf.scene.position.set(0,0,0);
//gltf.scene.scale.set(1,1,1);
//scene.add(gltf.scene);
//loadedModel= gltf;

}

function onProgress(xhr) {

document.getElementById("loader-element").style.visibility= "visible";
document.getElementById("progress-bar").style.visibility= "visible";

let progressBar= document.getElementById("progress-bar");
progressBar.style.width= ((xhr.loaded/xhr.total)*100).toFixed(2) + "%";

}

function onError(error) {

let err= document.getElementById("error");
err.innerHTML=`An Error Occurred: ${error}.`;

}

function modelLoad() {

return new Promise((resolve, reject) => {

glbLoader.load(currentMarker.options.modelUrl, (gltf) => {onLoad(gltf);
resolve(gltf);}, onProgress, 
(error) => reject(error));
});

}

function mapMarker (btn, data) {

for (let j of data) {

const marker = L.marker([j.lat, j.lon], { 
    icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-32] }),
    title: "Graffiti Spot", draggable: false, riseOnHover: true, modelUrl: j.model }).addTo(map);

marker.bindPopup(`<p>This is sample text.</p>`, { maxWidth: 200, minWidth: 50, autoPan: true, closeButton: true, keepInView: true });

if (btn) {
marker.on("popupopen", () => {
btn.style.visibility= "visible";
currentMarker= marker;
});
marker.on("popupclose", () => {
btn.style.visibility= "hidden";
currentMarker= null;
});
}
}
const bounds = L.latLngBounds(data.map(j => [j.lat, j.lon]));
map.fitBounds(bounds);

}

function buttonCreate () {

let btn= document.createElement("button");
btn.innerText= "View in AR";
btn.style.position= "fixed";
btn.style.bottom= "20px";
btn.style.right= "20px";
btn.style.zIndex= 9999;
btn.style.visibility= "hidden";
document.body.appendChild(btn);
return btn;

}

async function setupXR(event) {

try {
const xrSession= await navigator.xr.requestSession("immersive-ar",{requiredFeatures: ["hit-test"] });

log("session requested");
}

catch (e) {

const Model= await modelLoad();

document.getElementById("modal").style.display= "block";

const fallBtn1= document.getElementById("modal2D");
const fallBtn2= document.getElementById("retry");
const fallBtn3= document.getElementById("cancel");


fallBtn1.addEventListener("click",async () => {
document.getElementById("modal").style.display= "none";
const realCam= await navigator.mediaDevices.getUserMedia({video: {facingMode: {exact: "environment"}}, width: {ideal: window.innerWidth}, height: {ideal: window.innerHeight}, audio: false});
const vid= document.createElement("video");
vid.srcObject= realCam;

if (Model && Model.scene) {
Model.scene.position.set(0,1.2,0);
Model.scene.scale.set(1,1,1);
scene.add(Model.scene);
camera.position.set(0, 1.6, 3);
camera.lookAt(0,1.2,0);

renderer.domElement.style.position= "absolute";
renderer.domElement.style.pointerEvents= "auto";
renderer.domElement.style.display= "block";
renderer.domElement.style.zIndex= "10000";
renderer.setClearColor(0x000000, 0);
renderer.domElement.style.opacity= "1";

vid.setAttribute("autoplay", true);
vid.setAttribute("muted", true);
vid.setAttribute("playsinline", true);
vid.style.position = "fixed";
vid.style.top = "0";
vid.style.left = "0";
vid.style.width = "100%";
vid.style.height = "100%";
vid.style.zIndex = "9999";
document.body.appendChild(vid);
vid.play();

//renderer.domElement.addEventListener("resize", reSize);


/*const rayCast= new THREE.Raycaster();

const pointer= rayCast.vector2();
pointer.x= (event.clientX/window.innerWidth)*2-1;
pointer.y= -(event.clientY/window.innerHeight)*2-1;

rayCast.setFromCamera(pointer, camera);

const intersects= rayCast.intersectObject(Model, true);

if (intersects.length>0) {
const point= intersects[0].object;

}*/


vid.onloadeddata = () => {
if (vid.readyState>=2) {
renderer.setAnimationLoop(() => {
renderer.render(scene, camera);
});
}
}
}
});

fallBtn2.addEventListener("click", () => {
setupXR();
});

fallBtn3.addEventListener("click", () => {
document.getElementById("modal").style.display= "none";
});
}

//const xrSession= renderer.xr.getSession();
const space= await xrSession.requestReferenceSpace("local-floor");
/*const viewerSpace= await xrSession.requestReferenceSpace("viewer");
log("reference space requested");
const source= await xrSession.requestHitTestSource({space: viewerSpace });
log("hit test source requested");*/

/*renderer.setAnimationLoop(() => {
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
});*/
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
renderer.domElement.style.position = "fixed";
renderer.domElement.style.display = "none";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";
renderer.domElement.style.width= "100%";
renderer.domElement.style.height= "100%";
renderer.domElement.style.pointerEvents= "none";
document.body.appendChild(renderer.domElement);

renderer.xr.enabled= true;

const glbLoader= new THREE.GLTFLoader();

let currentMarker= null;

let arBtn= buttonCreate();
arBtn.addEventListener("click", setupXR);
mapMarker(arBtn, data);

});

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166/build/three.module.js";

import {GLTFLoader}
from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/loaders/GLTFLoader.js";

import {OrbitControls}
from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,1.5,4);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);

document.getElementById("scene").appendChild(renderer.domElement);

const light1 = new THREE.DirectionalLight(0xffffff,2);

light1.position.set(5,5,5);

scene.add(light1);

const red = new THREE.PointLight(0xff0033,30);

red.position.set(0,2,-2);

scene.add(red);

scene.add(new THREE.AmbientLight(0xffffff,0.5));


const loader = new GLTFLoader();

let soldier;

loader.load("../assets/models/untitled.glb",(gltf)=>{

    soldier = gltf.scene;

    soldier.position.set(0,-1,0);

    soldier.scale.set(1.5,1.5,1.5);

    scene.add(soldier);

});

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();


window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});
import * as THREE from 'three';
import { gsap, Power1 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Draggable } from "gsap/Draggable";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import fragmentShader from '../fragmentShader.js';


// Subrayado//


gsap.registerPlugin(ScrollTrigger);

function vertexShader() {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}


gsap.utils.toArray(".text-highlight").forEach((highlight) => {
  ScrollTrigger.create({
    trigger: highlight,
    start: "-100px center",
    onEnter: () => highlight.classList.add("active")
  });
});

const setHighlightStyle = (value) =>
  document.body.setAttribute("data-highlight", value);

setHighlightStyle('underline');

// slide

gsap.registerPlugin(Draggable);

var slideDelay = 3.5;
var slideDuration = 0.5;
var wrap = true;

var slides = document.querySelectorAll(".slide");
var progressWrap = gsap.utils.wrap(0, 1);

var numSlides = slides.length;

gsap.set(slides, {
  xPercent: i => i * 100
});

var wrapX = gsap.utils.wrap(-100, (numSlides - 1) * 100);
var timer = gsap.delayedCall(slideDelay, autoPlay);

var animation = gsap.to(slides, {
  xPercent: "+=" + (numSlides * 100),
  duration: 1,
  ease: "none",
  paused: true,
  repeat: -1,
  modifiers: {
    xPercent: wrapX
  }
});

var proxy = document.createElement("div");
var slideAnimation = gsap.to({}, {});
var slideWidth = 0;
var wrapWidth = 0;


var draggable = new Draggable(proxy, {
  trigger: ".slides-container",
  onPress: updateDraggable,
  onDrag: updateProgress,
  onThrowUpdate: updateProgress,
  snap: {     
    x: snapX
  }
});

function updateDraggable() {
  timer.restart(true);
  slideAnimation.kill();
  this.update();
}

function animateSlides(direction) {
    
  timer.restart(true);
  slideAnimation.kill();
  var x = snapX(gsap.getProperty(proxy, "x") + direction * slideWidth);
  
  slideAnimation = gsap.to(proxy, {
    x: x,
    duration: slideDuration,
    onUpdate: updateProgress
  });  
}

function autoPlay() {  
  if (draggable.isPressed || draggable.isDragging || draggable.isThrowing) {
    timer.restart(true);
  } else {
    animateSlides(-1);
  }
}

function updateProgress() { 
  animation.progress(progressWrap(gsap.getProperty(proxy, "x") / wrapWidth));
}

function snapX(value) {
  let snapped = gsap.utils.snap(slideWidth, value);
  return wrap ? snapped : gsap.utils.clamp(-slideWidth * (numSlides - 1), 0, snapped);
}

function resize() {
  
  var norm = (gsap.getProperty(proxy, "x") / wrapWidth) || 0;
  
  slideWidth = slides[0].offsetWidth;
  wrapWidth = slideWidth * numSlides;
  
  wrap || draggable.applyBounds({minX: -slideWidth * (numSlides - 1), maxX: 0});
  
  gsap.set(proxy, {
    x: norm * wrapWidth
  });
  
  animateSlides(0);
  slideAnimation.progress(1);
}

if (numSlides > 0){
  resize();
  window.addEventListener("resize", resize);
}


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#astronaut-canvas'),
});

const clock = new THREE.Clock();

const glftLoader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
let decoderPath = 'https://www.gstatic.com/draco/v1/decoders/';

dracoLoader.setDecoderPath(decoderPath );
glftLoader.setDRACOLoader( dracoLoader );


renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);


renderer.render(scene, camera);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/ window.innerHeight;

  camera.updateProjectionMatrix();
});

// Lights

//const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

var light = new THREE.DirectionalLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

//directionalLight.position.set(4, 0, 54);
//scene.add(directionalLight);

//const pointLight = new THREE.PointLight(0xff5733);
// const pointLight = new THREE.PointLight(0xb7b7b7);
// pointLight.position.set(0, 0, 0);
// scene.add(pointLight);

const pointLight = new THREE.PointLight( 0xffffff);
pointLight.position.set( -2 , -2  , -6  );

scene.add( pointLight );

const ambientLight = new THREE.AmbientLight(0xd16161);
scene.add(ambientLight);

//Plane

const planeGeometry = new THREE.PlaneGeometry(3,3,64, 64)

const planeMaterial = new THREE.MeshStandardMaterial({color:'red'})

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

//scene.add(plane);
plane.position.z = -5;
plane.position.x = 0;
plane.position.y = 0;
plane.rotation.x = 181;

// Stars
let material = new THREE.PointsMaterial({
  size: 0.001,
  vertexColors: true 
})

// const textureStar = new THREE.TextureLoader().load('../particle_3.webp');
// material = new THREE.ShaderMaterial({
//   extensions: {
//     derivatives: "#extension GL_DES_standard_derivatives: enable"
//   },
//   side: THREE.DoubleSide,
//   size: 0.001,
//   depthTest: false,
//   transparent: true,
//   uniforms: {
//     uTexture : {value: textureStar},
//     time: { type: "f", value: 1.0 },
//     uColor: {value: new THREE.Color("#f7b373")},
//     resolution: { type: "v2", value: new THREE.Vector2() }
//   },
//   fragmentShader: fragmentShader(),
//   vertexShader: vertexShader(),
// });

const particleGeometry = new THREE.BufferGeometry;
const particlesCnt = 16000;

//const posArray = new Float32Array(particlesCnt * 3);
const posArray = new Float32Array(5333);

const colors = [];
const color = new THREE.Color();
const n = 1000, n2 = n / 2; // particles spread in the cube

for (let i = 0; i < particlesCnt; i++) {
  //xyz
  posArray[i] = (Math.random() - 0.5);
}

for(let i = 0; i < particlesCnt; i+=3) {
  // colors

  const x = Math.random() * n - n2;
  const y = Math.random() * n - n2;
  const z = Math.random() * n - n2;

  const vx = ( x / n ) + 0.5;
  const vy = ( y / n ) + 0.5;
  const vz = ( z / n ) + 0.5;

  color.setRGB( vx, vy, vz );

  colors.push( color.r, color.g, color.b );
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particleGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

const particlesMesh = new THREE.Points(particleGeometry, material)
scene.add(particlesMesh);

// Earth

let earth = undefined
glftLoader.load("astronauta_low.glb", (glft) => {
  earth = glft.scene;
  scene.add(earth);
  earth.position.z = -6;
  earth.position.x = 4;
  earth.position.y = -2;
})


// Background

scene.background = new THREE.Color('#000113');

// Scroll Animation

const t = document.body.getBoundingClientRect().top;

camera.position.z = t * 0.0001;
camera.position.x = t * -0.00005;
camera.rotation.y = t * -0.00002;

function moveSpaceWithMouse(e) {
  camera.position.y = e.clientY * 0.0001;
  camera.position.x = e.clientX * -0.00005;

  if (earth) {
    earth.rotation.x = e.clientX * -0.2;
    earth.rotation.y = e.clientY * -0.001;
  }

}

document.addEventListener('mousemove', moveSpaceWithMouse)


// Animation Loop

function animate() {
  const t = requestAnimationFrame(animate);

  // controls.update();

  particlesMesh.rotation.y += 0.001;
  const time = clock.getElapsedTime();
  
  if (earth) {
    earth.position.y = Math.cos( time ) * 0.2 - 2;
    earth.rotation.x = 0.2;
    earth.rotation.y = time * -0.2;
  }

  renderer.render(scene, camera);
}

animate();


////// GSAP

const boxes = gsap.utils.toArray('.elem');

gsap.registerPlugin(ScrollTrigger);


boxes.forEach((box, i) => {
  gsap.from(box, {
    autoAlpha: 0,
    yPercent: 30,
    ease: Power1.easeOut,
    scrollTrigger: {
      trigger: box,
      start: "bottom bottom",
      toggleActions: "play none none reverse",
      //pin: true,   // pin the trigger element while active
      //start: "top top", // when the top of the trigger hits the top of the viewport
      //end: "+=500", // end after scrolling 500px beyond the start
      //scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar,
    }
  });
  gsap.from(box, {
    opacity: 0,
    ease: Power1.easeOut,
    scrollTrigger: {
      trigger: box,
      start: "top 25%",
      //toggleActions: "play none none reverse"
      //pin: true,   // pin the trigger element while active
      //start: "top top", // when the top of the trigger hits the top of the viewport
      //end: "+=500", // end after scrolling 500px beyond the start
      //scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar,
    }
  });
});



// Abrir menu
var tl = new gsap.timeline({ paused:true });

const drawer = document.getElementById("menu-id");
const drawerVeil = document.getElementById("drawer-veil");
const toggle = document.getElementById("menu-btn");
const toggleAbout = document.getElementById("menu-btn");
const spaceship = document.getElementById("spaceship-id");
const closeDrawerBtn = document.getElementById("close-contact-us");

// if the drawer is open or not
// let openDrawer = false;

// tl
//   .to(drawer, { delay: 0.1, duration:1, x: 0, ease: Power1.easeOut }, "<")
//   .to(drawerVeil, 0.15, { autoAlpha: 0.5 }, 0)
//   .to(toggleAbout, 0.05, { display: 'none' }, 0)
//   .reverse();

// toggle.onclick = () => {
//   openDrawer = tl.reversed();
//   tl.reversed( !tl.reversed() );
//   toggle.style.display = "none";
// };

// const reverseDrawerTween = () => {
//   tl.reverse();
//   openDrawer = tl.reversed();
//   toggle.style.removeProperty('display');
// };

// drawerVeil.onclick = reverseDrawerTween;
// closeDrawerBtn.onclick = reverseDrawerTween;


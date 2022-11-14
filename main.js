import './style.css';
import * as THREE from 'three';
import { gsap, Power1 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


// Setup

// const loadingManager = new THREE.LoadingManager( () => {
	
//   const loadingScreen = document.getElementById( 'loading-screen' );
//   loadingScreen.classList.add( 'fade-out' );
  
//   console.log('asd')
//   // optional: remove loader from DOM via event listener
//   loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
  
// } );


// function onTransitionEnd( event ) {

// 	const element = event.target;
// 	element.remove();
	
// }

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
});

//const glftLoader = new GLTFLoader()


renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/ window.innerHeight;

  camera.updateProjectionMatrix();
})

// Lights

const colorLight = 0xffffff, intensity = 1;
const light = new THREE.DirectionalLight(colorLight, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const pointLight = new THREE.PointLight(0xff5733);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(light, pointLight);

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
const material = new THREE.PointsMaterial({
  size: 0.001,
  vertexColors: true 
})

const particleGeometry = new THREE.BufferGeometry;
const particlesCnt = 16000;

// const posArray = new Float32Array(5334); // Arreglo por firefox, revisar
const posArray = new Float32Array(16000); // Arreglo por firefox, revisar


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

// Background

scene.background = new THREE.Color('#000113');

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * 0.0001;
  camera.position.x = t * -0.00005;
  camera.rotation.y = t * -0.00002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  // controls.update();

  particlesMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();


/// COPY to clipboard mail

function copyToClipboard() {
  //source: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  // Get the text field
  //var copyText = document.getElementById("myInput");

  // Select the text field
  //copyText.select();
  //copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText('labs@eryx.com');
  alert("copiado")
}

document.getElementById("copy_to_clipboard").onclick = () => copyToClipboard();


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


// Abrir contact us


var tl = new gsap.timeline({ paused:true });

const drawer = document.getElementById("contact-us-id");
const drawerVeil = document.getElementById("drawer-veil");
const toggleOpenContact = document.getElementById("open-contact-us");
const body = document.getElementById("body-id");
const closeDrawerBtn = document.getElementById("close-contact-us-btn-id");


// if the drawer is open or not
let openDrawer = false;

tl
  .to(body, {overflow: "hidden"})
  .to(drawer, { display: "flex", ease: Power1.easeOut })
  .to(drawerVeil, { autoAlpha: 0.5 }, 0)
  .reverse();

toggleOpenContact.onclick = () => {
  openDrawer = tl.reversed();
  tl.reversed( !tl.reversed() );
  toggleOpenContact.style.display = "none";
};

const reverseDrawerTween = () => {
  tl.reverse();
  openDrawer = tl.reversed();
  toggleOpenContact.style.display = "flex";
};

drawerVeil.onclick = reverseDrawerTween;
closeDrawerBtn.onclick = reverseDrawerTween;


// Animacion de menu imagenes

const projectImages = document.getElementsByClassName("project-image");
Array.from(projectImages).forEach( (p, i) => {
  console.log(i)
  if (i !== 0) {
    p.style.display = "none";
  }
});

const projectTitles = document.getElementsByClassName("project_title");

const moraImage =  document.getElementById("mora-image");
const ssfImage =  document.getElementById("ssf-image");
const auroraImage =  document.getElementById("aurora-image");
const huespedImage =  document.getElementById("aurora-image");
const faduVivaImage =  document.getElementById("fadu-image");

const images = [moraImage, ssfImage, faduVivaImage, auroraImage];

// Por default mostramos mora
moraImage.style.display = "inline";

Array.from(projectTitles).forEach( (p, i) => {
  p.addEventListener("mouseover", () => {
    images.map(i => i.style.display = "none");
    if (i === 0){ssfImage.style.display = "inline";}
    if (i === 1){moraImage.style.display = "inline";}
    if (i === 2){faduVivaImage.style.display = "inline";}
    if (i === 3){auroraImage.style.display = "inline";}
    if (i === 4){huespedImage.style.display = "inline";}
  });
});


// Animación del logo
const fixedLogo =  document.getElementById("logo-fixed-id");
//fixedLogo.style.display = "none";


const startLogo =  document.getElementById("logo-start-id");

gsap.from(startLogo, {
  duration: 0.8,
  ease: "power1.out",
  display: 'inline',
  once: true,
  y: 100,
  scrollTrigger: fixedLogo,
  scrub: 0.5 ,
  onComplete: () => console.log(fixedLogo)
});


// Animación flecha bajar

const arrowScrollDown =  document.getElementById("arrow-down-id");

gsap.to(arrowScrollDown, {
  duration: 1.3,
  y: "+=20px",
  yoyo: true,
  repeat: -1,
  ease: "power2.easeOut"
});

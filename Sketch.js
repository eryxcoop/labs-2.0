import * as THREE from 'three';
import fragmentShader from './fragmentShader.js';
import vertexShader from './vertexShader.js';

function lerp(a,b,t) {
  return a*(1-t) + b*t;
}

export default class Sketch {
  constructor(settings) {
    this.scene = new THREE.Scene;

    this.container = settings.dom;
    this.materials = [];
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer =  new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0,0,1);
    this.camera.rotation.z = -0.5
    this.camera.rotation.y =0
    this.camera.rotation.x = 1
    this.time = 0;

    let options = [
      {
        min_radius: 0.4,
        max_radius: 1.4,
        color: '#f7b373',
        size: 1
      },
      {
        min_radius: 0.7,
        max_radius: 1.2,
        color: '#0081CB',
        size: 1
      }
    ]

    options.forEach(op => {
      this.addObject(op);
    })

    this.resize();
    this.render();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // this.height = this.container.offsetHeight;
    // this.width = this.container.offsetWidth;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  addObject(op) {
    let that = this;
    let count = 4000;

    let min_radius = op.min_radius;
    let max_radius = op.max_radius;

    let particlegeo = new THREE.PlaneBufferGeometry(1,1);
    let geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute('position', particlegeo.getAttribute('position'));
    geo.index = particlegeo.index;

    let pos = new Float32Array(count * 3);
    for(let i = 0 ; i < count; i++) {
      let theta = Math.random()*2*Math.PI;
      let max_rad = lerp(max_radius-0.1, max_radius+0.1, Math.random());
      let min_rad = lerp(min_radius-0.1, min_radius+0.1, Math.random());
      let r = lerp(min_rad, max_rad, Math.random())

      let x = r * Math.sin(theta)
      let y = (Math.random() - 0.5) * 0.1;
      let z =  r * Math.cos(theta);

      pos.set([x,y + 0.8, z - 0.1], i*3);
    }

    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false));
    const texture = new THREE.TextureLoader().load('./particle_3.webp');
    let material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_DES_standard_derivatives: enable"
      },
      side: THREE.DoubleSide,
      depthTest: false,
      transparent: true,
      size: 0.001,
      uniforms: {
        uTexture : {value: texture},
        time: { type: "f", value: 1.0 },
        uColor: {value: new THREE.Color(op.color)},
        resolution: { type: "v2", value: new THREE.Vector2() }
      },
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader()
    });
    this.materials.push(material);
    this.geometry = new THREE.PlaneGeometry(1,1,1,1);
    this.points = new THREE.Mesh(geo, material);
    this.scene.add(this.points);
  }

  render() {
    this.time += 0.05;
    this.materials.forEach(m => {
      m.uniforms.time.value = this.time*0.5;
    })
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

}

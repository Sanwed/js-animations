import * as THREE from 'three';
import {createElement} from '../utils';

class Plane {
  constructor() {
    this.propeller = null;
    
    this.mesh = new THREE.Object3D();
    this.init();
  }
  
  init() {
    this.createCab();
    this.createWings();
    this.createPropeller();
  }
  
  createPropeller() {
    const geomPropeller = new THREE.BoxGeometry(15, 0.5, 0.5);
    const matPropeller = new THREE.MeshStandardMaterial({color: '#000'});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.position.set(0, 0, -5);
    this.mesh.add(this.propeller);
  }
  
  createWings() {
    const geom = new THREE.BoxGeometry(5, 1, 3);
    const mat = new THREE.MeshStandardMaterial({color: '#911717'});
    const leftWing = new THREE.Mesh(geom, mat);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    leftWing.position.set(-5, 0, 0);
    this.mesh.add(leftWing);
    
    const rightWing = new THREE.Mesh(geom, mat);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    rightWing.position.set(5, 0, 0);
    this.mesh.add(rightWing);
  }
  
  createCab() {
    const geom = new THREE.BoxGeometry(5, 5, 10);
    const mat = new THREE.MeshStandardMaterial({color: '#781616'});
    const cab = new THREE.Mesh(geom, mat);
    this.mesh.add(cab);
  }
}

class Flight {
  constructor(body) {
    this.body = body;
    
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.width = null;
    this.height = null;
    
    this.plane = null;
    
    this.isLeftPressed = false;
    this.isRightPressed = false;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.isLeftPressed = true;
      }
      if (e.key === 'ArrowRight') {
        this.isRightPressed = true;
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') {
        this.isLeftPressed = false;
      }
      if (e.key === 'ArrowRight') {
        this.isRightPressed = false;
      }
    });
  }
  
  init() {
    this.container = createElement('div', {className: 'world'});
    this.body.append(this.container);
    this.createScene();
    this.createLight();
    this.createPlane();
    
    this.render();
  }
  
  createScene() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.width, this.height);
    
    this.container.append(this.renderer.domElement);
    
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 1, 1000);
    this.camera.position.z = 200;
    this.scene.add(this.camera);
  }
  
  createPlane() {
    this.plane = new Plane();
    this.plane.mesh.position.set(0, -10, 170);
    this.plane.mesh.scale.set(0.7, 0.7, 0.7);
    this.scene.add(this.plane.mesh);
  }
  
  createLight() {
    const directionalLight = new THREE.DirectionalLight('#fff', 1, 100);
    directionalLight.position.set(0, 0, -100);
    directionalLight.castShadow = true;
    
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 1000;
    this.scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight('#fff'); // soft white light (мягкий белый свет)
    this.scene.add(ambientLight);
    
  }
  
  render() {
    this.plane.propeller.rotation.z += 0.2;
    
    this.updatePlane();
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
  
  updatePlane() {
    if (this.isLeftPressed) {
      this.plane.mesh.position.x -= 0.1;
      if (this.plane.mesh.rotation.y < 0.2) {
        this.plane.mesh.rotation.y += 0.01;
      }
    } else if (this.isRightPressed) {
      this.plane.mesh.position.x += 0.1;
      if (this.plane.mesh.rotation.y > -0.2) {
        this.plane.mesh.rotation.y -= 0.01;
      }
    } else {
      if (this.plane.mesh.rotation.y !== 0) {
        if (this.plane.mesh.rotation.y > 0) {
          this.plane.mesh.rotation.y -= 0.01;
        } else {
          this.plane.mesh.rotation.y += 0.01;
        }
      }
    }
  }
}

export default Flight;

import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

const container = document.querySelector(".rightside");
const scaleFactor = 0.8; // Scale factor to reduce width and height
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40, // Reduced FOV for tighter view
  container.clientWidth / container.clientHeight, // Aspect ratio
  0.1,
  1000
);

const height = container.clientHeight * scaleFactor;
const width = height * camera.aspect;

// Set the renderer size with scaling
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Fixed camera position
camera.position.z = 250;
camera.position.y = 100;
camera.updateProjectionMatrix();

// Trackball controls
const controls = new TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.noZoom = true;
controls.rotateSpeed = 2;
controls.minDistance = 250;
controls.maxDistance = 250;

// Add a group to the scene
const group = new THREE.Group();
scene.add(group);
group.rotation.y = 2;

// Array for subgroups and paths
let subgroups = [];
let sampler;
let paths = [];

// Define the Path class
class Path {
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.line = new THREE.Line(
      this.geometry,
      new THREE.LineBasicMaterial({
        color: 0xbbde2d,
        transparent: true,
        opacity: 0.6,
      })
    );
    this.vertices = [];

    const tempPosition = new THREE.Vector3();
    sampler.sample(tempPosition);
    this.previousPoint = tempPosition.clone();
  }

  update() {
    const tempPosition = new THREE.Vector3();
    let pointFound = false;
    while (!pointFound) {
      sampler.sample(tempPosition);
      if (tempPosition.distanceTo(this.previousPoint) < 12) {
        this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
        this.previousPoint = tempPosition.clone();
        pointFound = true;
      }
    }
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.vertices, 3)
    );
  }
}

// Load airplane model
let airplane = new THREE.Group();
new OBJLoader().load(
  "https://assets.codepen.io/127738/Airplane_model2.obj",
  (obj) => {
    airplane = obj;
    const mat = new THREE.MeshPhongMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
    });

    airplane.children.forEach((child) => {
      child.geometry.scale(0.013, 0.013, 0.013);
      child.geometry.translate(0, 122, 0);
      child.material = mat;
    });

    const angles = [0.3, 1.3, 2.14, 2.6];
    const speeds = [0.008, 0.01, 0.014, 0.02];
    const rotations = [0, 2.6, 1.5, 4];

    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.speed = speeds[i];
      subgroups.push(g);
      group.add(g);

      const g2 = new THREE.Group();
      let _airplane = airplane.clone();
      g.add(g2);
      g2.add(_airplane);
      g2.rotation.x = rotations[i];
      g.rotation.y = angles[i];

      g.reverse = i < 2;
      if (i < 2) {
        _airplane.children[0].geometry = airplane.children[0].geometry
          .clone()
          .rotateY(Math.PI);
      }
    }
  }
);

// Load earth model
new OBJLoader().load(
  "https://assets.codepen.io/127738/NOVELO_EARTH.obj",
  (obj) => {
    const earth = obj.children[0];
    const box = new THREE.Box3().setFromObject(earth);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center and scale the Earth
    earth.geometry.translate(-center.x, -center.y, -center.z);
    earth.geometry.scale(0.35, 0.35, 0.35);

    // Split Earth into land and water
    let positions = Array.from(earth.geometry.attributes.position.array).splice(
      0,
      3960 * 3
    );
    const landGeom = new THREE.BufferGeometry();
    landGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const land = new THREE.Mesh(landGeom);

    positions = Array.from(earth.geometry.attributes.position.array).splice(
      3960 * 3,
      540 * 3
    );
    const waterGeom = new THREE.BufferGeometry();
    waterGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    waterGeom.computeVertexNormals();

    const waterMat = new THREE.MeshLambertMaterial({
      color: 0x0da9c3,
      transparent: true,
      opacity: 1,
    });
    const water = new THREE.Mesh(waterGeom, waterMat);
    group.add(water);

    const light = new THREE.HemisphereLight(0xccffff, 0x000033, 1);
    scene.add(light);

    sampler = new MeshSurfaceSampler(land).build();

    for (let i = 0; i < 24; i++) {
      const path = new Path();
      paths.push(path);
      group.add(path.line);
    }

    // Center and scale the group
    const groupBox = new THREE.Box3().setFromObject(group);
    const groupCenter = new THREE.Vector3();
    groupBox.getCenter(groupCenter);
    group.position.set(-groupCenter.x, -groupCenter.y, -groupCenter.z);
    const maxDimension = Math.max(
      groupBox.getSize(new THREE.Vector3()).x,
      groupBox.getSize(new THREE.Vector3()).y,
      groupBox.getSize(new THREE.Vector3()).z
    );
    const scale = 200 / maxDimension;
    group.scale.set(scale, scale, scale);
  }
);

function animate() {
  requestAnimationFrame(animate);

  // Rotate the whole scene
  group.rotation.y += 0.001;

  // Rotate each plane
  subgroups.forEach((g) => {
    g.children[0].rotation.x += g.speed * (g.reverse ? -1 : 1);
  });

  // Update each path
  paths.forEach((path) => {
    if (path.vertices.length < 35000) {
      path.update();
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  const height = container.clientHeight * scaleFactor;
  const width = height * camera.aspect;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});


<template>
  <div ref="container" class="absolute inset-0 z-0"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as THREE from "three";

const container = ref<HTMLDivElement | null>(null);
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let stars: THREE.Points;
let animationId: number;

function createStarField() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const positions = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    positions.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    sizeAttenuation: true,
  });

  return new THREE.Points(starGeometry, starMaterial);
}

onMounted(() => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value?.appendChild(renderer.domElement);

  stars = createStarField();
  scene.add(stars);

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    stars.rotation.y += 0.0008;
    stars.rotation.x += 0.0005;
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("resize", onResize);
});

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onResize);
  renderer.dispose();
});
</script>

<style scoped>
div {
  pointer-events: none;
  z-index: -1;
}
</style>

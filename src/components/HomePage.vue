<template>
  <div class="home-page">
    <canvas id="three-bg"></canvas>
    <NavBar />
    <div class="hero-section">
      <h2>Welcome <span>{{ username }}</span>!</h2>
      <h1><span>Shoe Carnival</span></h1>
      <p class="tagline">Step into the world of premium footwear. Shop your style!</p>
      <router-link to="/products">
        <button class="shop-now">Explore Products</button>
      </router-link>
    </div>
    <div class="model-viewer">
  <canvas id="object-canvas"></canvas>
</div>

  </div>
</template>

<script>
import * as THREE from 'three'
import NavBar from './NavBar.vue'

export default {
  name: 'HomePage',
  components: { NavBar },
  computed: {
    username() {
      return this.$store.state.username
    }
  },
  mounted() {
  const canvas = document.getElementById("three-bg");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x060c21, 1); // Match background

  // Floating particles
  const geometry = new THREE.SphereGeometry(0.05, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xe91e63 });

  const stars = [];
  for (let i = 0; i < 150; i++) {
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    // Give each star a small velocity
    star.userData.velocity = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    };
    scene.add(star);
    stars.push(star);
  }

  function animate() {
    requestAnimationFrame(animate);

    stars.forEach(star => {
      // Move star
      star.position.x += star.userData.velocity.x;
      star.position.y += star.userData.velocity.y;
      star.position.z += star.userData.velocity.z;

      // Reset if out of bounds
      if (star.position.length() > 15) {
        star.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');

.home-page {
  background: linear-gradient(135deg, #060c21 0%, #1a1a40 100%);
  min-height: 100vh;
  font-family: 'Oswald', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 4rem 1rem;
  position: relative;
  overflow: hidden;
}

#three-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #060c21;
}

.hero-section,
.NavBar {
  z-index: 1;
  position: relative;
}

.hero-section h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.hero-section h2 span {
  color: #ff4081;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 2px 2px 4px #000;
}

.hero-section h1 span {
  color: #ff4081;
  font-weight: 900;
  letter-spacing: 4px;
}

.tagline {
  font-size: 1.2rem;
  color: #cccccc;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.shop-now {
  background: linear-gradient(135deg, #e91e63, #5d02ff);
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
}

.shop-now:hover {
  background: linear-gradient(135deg, #5d02ff, #e91e63);
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(93, 2, 255, 0.4);
}
</style>

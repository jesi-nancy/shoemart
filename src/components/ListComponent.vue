<template>
  <div class="premium-theme">
    <canvas id="three-bg"></canvas>
    <Navbar />

    <div class="container py-5 content-wrapper">
      <h2 class="text-center mb-4 section-title">Premium Collection</h2>

      <!-- Search and Sort Controls -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 filter-bar">
        <input
          type="text"
          class="form-control mb-3 mb-md-0 search-input"
          placeholder="Search shoes..."
          v-model="searchQuery"
        />

        <select class="form-select sort-select ms-md-3" v-model="sortOption">
          <option disabled value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <!-- Shoe Cards -->
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          v-for="shoe in filteredShoes"
          :key="shoe.id"
        >
          <div class="card h-100 shadow border-0 rounded-4 shoe-card">
            <img :src="shoe.image" class="card-img-top rounded-top-4" :alt="shoe.name" />
            <div class="card-body">
              <h5 class="card-title fw-bold">{{ shoe.name }}</h5>
              <p class="card-text">{{ shoe.description }}</p>
              <p class="mb-1 rating"><i class="bi bi-star-fill"></i> {{ shoe.rating }}</p>
              <p class="mb-1 sizes">Sizes: {{ shoe.size }}</p>
              <p class="fw-bold price">₹{{ shoe.discountPrice }}</p>
              <div class="d-flex justify-content-between mt-2">
                <button class="btn btn-outline-light btn-sm" @click="viewShoe(shoe)">View</button>
                <button class="btn btn-primary btn-sm fw-bold" @click="addToCart(shoe)">
                  <i class="bi bi-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { markRaw } from 'vue';
import shoes from '@/assets/shoes.json';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Navbar from '@/components/NavBar.vue';

export default {
  name: 'PremiumCollection',
  components: { Navbar },
  data() {
    return {
      shoes,
      searchQuery: '',
      sortOption: '',
      threeScene: null,
      camera: null,
      renderer: null,
      stars: null,
      animationId: null
    };
  },
  computed: {
    filteredShoes() {
      let filtered = this.shoes.filter(shoe =>
        shoe.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        shoe.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.sortOption === 'lowToHigh') {
        filtered.sort((a, b) => a.discountPrice - b.discountPrice);
      } else if (this.sortOption === 'highToLow') {
        filtered.sort((a, b) => b.discountPrice - a.discountPrice);
      } else if (this.sortOption === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    function addToCart(product) {
      store.dispatch('addToCart', product);
    }

    function viewShoe(product) {
      router.push(`/view/${product.id}`);
    }

    return {
      addToCart,
      viewShoe
    };
  },
  mounted() {
    this.initThreeJSBackground();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    this.cleanupThreeJS();
  },
  methods: {
    initThreeJSBackground() {
      const canvas = document.getElementById("three-bg");
      this.threeScene = markRaw(new THREE.Scene());
      this.camera = markRaw(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
      this.camera.position.z = 5;
      this.renderer = markRaw(new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x060c21, 1);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.createParticles();
      this.animate();
    },

    createParticles() {
      const particleCount = window.innerWidth < 768 ? 75 : 150;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);
      const color = new THREE.Color(0xe91e63);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        colorArray[i * 3] = color.r;
        colorArray[i * 3 + 1] = color.g;
        colorArray[i * 3 + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particles = markRaw(new THREE.Points(geometry, material));
      particles.userData = {
        velocities: positions.slice(),
        originalCount: particleCount
      };

      this.threeScene.add(particles);
      this.stars = particles;
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      if (this.stars) {
        const positions = this.stars.geometry.attributes.position.array;
        const velocities = this.stars.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * 0.01;
          positions[i + 1] += velocities[i + 1] * 0.01;
          positions[i + 2] += velocities[i + 2] * 0.01;

          if (Math.abs(positions[i]) > 15 || Math.abs(positions[i + 1]) > 15 || Math.abs(positions[i + 2]) > 15) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
          }
        }

        this.stars.geometry.attributes.position.needsUpdate = true;
      }
      this.renderer.render(this.threeScene, this.camera);
    },

    handleResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.stars) {
          const newCount = window.innerWidth < 768 ? 75 : 150;
          if (newCount !== this.stars.userData.originalCount) {
            this.threeScene.remove(this.stars);
            this.createParticles();
          }
        }
      }
    },

    cleanupThreeJS() {
      cancelAnimationFrame(this.animationId);
      window.removeEventListener('resize', this.handleResize);
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        const canvas = this.renderer.domElement;
        canvas.width = 1;
        canvas.height = 1;
        this.renderer = null;
      }
      if (this.stars) {
        this.stars.geometry.dispose();
        this.stars.material.dispose();
        this.stars = null;
      }
      this.threeScene = null;
      this.camera = null;
    }
  }
};
</script>


<style scoped>
.premium-theme {
  min-height: 100vh;
  color: #f1f1f1;
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-top:100px;
  
}

#three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-top: 100px;
  
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #e91e63, #5d02ff);
  border-radius: 3px;
}

.filter-bar {
  background-color: rgba(26, 26, 46, 0.7);
  padding: 1.2rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.search-input,
.sort-select {
  max-width: 300px;
  background-color: rgba(15, 17, 43, 0.8);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus,
.sort-select:focus {
  background-color: rgba(15, 17, 43, 0.9);
  border-color: #5d02ff;
  box-shadow: 0 0 0 0.2rem rgba(93, 2, 255, 0.25);
  outline: none;
}

.shoe-card {
  background-color: rgba(15, 17, 43, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.shoe-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 25px rgba(233, 30, 99, 0.3);
  border-color: rgba(233, 30, 99, 0.3);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.shoe-card:hover .card-img-top {
  transform: scale(1.05);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #fff;
}

.card-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  min-height: 60px;
}

.rating {
  color: #ffc107;
  font-weight: 500;
}

.sizes {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.price {
  color: #00e676;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
}

.btn-primary {
  background: linear-gradient(135deg, #e91e63, #5d02ff);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5d02ff, #e91e63);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .search-input,
  .sort-select {
    max-width: 100%;
    width: 100%;
  }
  
  .sort-select {
    margin-top: 15px;
    margin-left: 0 !important;
  }
}
</style>
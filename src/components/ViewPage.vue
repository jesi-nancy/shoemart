<template>
  <div class="view-page">
    <canvas class="bg-canvas"></canvas>
    <NavBar />
    <div class="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div class="view-box">
        <div v-if="shoe" class="row align-items-center">
          <!-- Left: Image + Thumbnails -->
          <div class="col-md-6 mb-4">
            <img :src="selectedImage" class="img-fluid shoe-image" />
            <div class="thumbs mt-3 d-flex justify-content-center gap-2">
              <img
                v-for="(img, index) in shoe.images"
                :key="index"
                :src="img"
                class="thumb-image"
                :class="{ active: selectedImage === img }"
                @click="selectedImage = img"
              />
            </div>
          </div>

          <!-- Right: Details -->
          <div class="col-md-6 text-light">
            <h2>{{ shoe.name }}</h2>
            <p>{{ shoe.description }}</p>
            <p>⭐ {{ shoe.rating }}</p>
            <p><strong>Sizes:</strong> {{ shoe.size }}</p>
            <p><strong>Stock:</strong> {{ stockCount }} pairs</p>
            <p class="product-price">₹{{ shoe.discountPrice }}</p>

            <div class="info-highlights">
              <p>🚚 Free Delivery</p>
              <p>📦 Delivery by {{ estimatedDate }}</p>
            </div>

            <div class="mt-4 d-flex flex-wrap gap-3">
              <button class="btn btn-pink" @click="addToCart">Add to Cart</button>
              <router-link to="/products" class="btn btn-outline-light">← Back to Products</router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-light text-center">Loading product details...</div>
      </div>
    </div>
  </div>
</template>

<script>
import shoes from '@/assets/shoes.json'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import NavBar from './NavBar.vue'
import { ref, computed, onMounted } from 'vue'
import * as THREE from 'three'

export default {
  name: 'ViewPage',
  components: { NavBar },
  setup() {
    const route = useRoute()
    const store = useStore()
    const id = Number(route.params.id)
    const shoe = shoes.find(s => s.id === id)

    const selectedImage = ref(shoe?.image)
    const stockCount = ref(Math.floor(Math.random() * 5) + 1)

    const estimatedDate = computed(() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toDateString()
    })

    function addToCart() {
      store.dispatch('addToCart', shoe)
    }

    onMounted(() => {
  const canvas = document.querySelector('.bg-canvas')
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x060c21, 1) // matches HomePage bg

  // ✅ Pink Particle Background (buffer geometry like HomePage)
  const geometry = new THREE.BufferGeometry()
  const particleCount = 150
  const positions = new Float32Array(particleCount * 3)
  const colorArray = new Float32Array(particleCount * 3)
  const pink = new THREE.Color(0xe91e63)

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 20
    const y = (Math.random() - 0.5) * 20
    const z = (Math.random() - 0.5) * 20
    positions.set([x, y, z], i * 3)
    colorArray.set([pink.r, pink.g, pink.b], i * 3)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  const animate = () => {
    requestAnimationFrame(animate)

    const pos = particles.geometry.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += 0.001
      if (pos[i + 1] > 10) pos[i + 1] = -10
    }

    particles.geometry.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})


    return { shoe, selectedImage, stockCount, estimatedDate, addToCart }
  }
}
</script>

<style scoped>
.view-page {
  background-color: #060c21;
  min-height: 100vh;
  font-family: 'Oswald', sans-serif;
  position: relative;
  overflow: hidden;
}

.bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.view-box {
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid #ffffff;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.shoe-image {
  height: 300px;
  width: 100%;
  object-fit: contain;
  border-radius: 16px;
  background-color: #111432;
  padding: 10px;
}

.thumbs .thumb-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.3s;
}

.thumbs .thumb-image:hover {
  border-color: #5d02ff;
}

.thumbs .thumb-image.active {
  border-color: #e91e63;
}

.product-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #5d02ff;
  margin: 1rem 0;
}

.btn-pink {
  background: linear-gradient(315deg, #e91e63, #5d02ff);
  border: none;
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-pink:hover {
  background: linear-gradient(315deg, #5d02ff, #e91e63);
}

.btn-outline-light {
  border: 2px solid #fff;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s ease;
}

.btn-outline-light:hover {
  background-color: #ffffff20;
  color: #e91e63;
  border-color: #e91e63;
}

.info-highlights p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
</style>

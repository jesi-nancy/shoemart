<template>
  <div class="cart-page">
    <canvas id="three-bg"></canvas>
    <NavBar />
    <div class="container py-5 content-wrapper">
      <h2 class="text-center text-light mb-4">Your Cart</h2>

      <div v-if="cartItems.length > 0">
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="cart-item d-flex align-items-center justify-content-between mb-4"
        >
          <div class="d-flex align-items-center gap-4">
            <img :src="item.image" class="item-image" />
            <div>
              <h5 class="text-light mb-1">{{ item.name }}</h5>
              <p class="text-light">₹{{ item.discountPrice }} x {{ item.quantity }}</p>
              <p class="text-warning">Total: ₹{{ item.discountPrice * item.quantity }}</p>
            </div>
          </div>
          <button class="btn btn-danger" @click="removeItem(index)">Remove</button>
        </div>

        <hr class="border-light" />
        <h4 class="text-light text-end me-3">Total Amount: ₹{{ totalAmount }}</h4>

        <div class="text-end">
          <router-link to="/placeorder" class="btn btn-success mt-3">
            Proceed to Payment
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        <p>Your cart is empty.</p>
        <router-link to="/products" class="btn btn-outline-light mt-3">← Continue Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import NavBar from './NavBar.vue'
import * as THREE from 'three'
import { markRaw } from 'vue'

export default {
  name: 'CartPage',
  components: { NavBar },
  setup() {
    const store = useStore()
    const cartItems = computed(() => store.state.cart)
    const totalAmount = computed(() =>
      store.state.cart.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
    )
    const removeItem = (index) => store.commit('removeFromCart', index)

    // 3D BG Variables
    let scene, camera, renderer, stars, animationId

    const initThreeJS = () => {
      const canvas = document.getElementById("three-bg")
      scene = markRaw(new THREE.Scene())

      camera = markRaw(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000))
      camera.position.z = 5

      renderer = markRaw(new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x060c21, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      createParticles()
      animate()
    }

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 75 : 150
      const color = 0xe91e63
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)
      const colorArray = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20

        const c = new THREE.Color(color)
        colorArray[i * 3] = c.r
        colorArray[i * 3 + 1] = c.g
        colorArray[i * 3 + 2] = c.b
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

      stars = markRaw(new THREE.Points(geometry, material))
      scene.add(stars)
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (stars) {
        const pos = stars.geometry.attributes.position.array
        for (let i = 0; i < pos.length; i += 3) {
          pos[i] += 0.01
          pos[i + 1] += 0.01
          pos[i + 2] += 0.01

          if (Math.abs(pos[i]) > 15 || Math.abs(pos[i + 1]) > 15 || Math.abs(pos[i + 2]) > 15) {
            pos[i] = (Math.random() - 0.5) * 10
            pos[i + 1] = (Math.random() - 0.5) * 10
            pos[i + 2] = (Math.random() - 0.5) * 10
          }
        }
        stars.geometry.attributes.position.needsUpdate = true
      }
      renderer.render(scene, camera)
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const cleanup = () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
      }
      if (stars) {
        stars.geometry.dispose()
        stars.material.dispose()
      }
      scene = null
      camera = null
      renderer = null
      stars = null
    }

    onMounted(() => {
      initThreeJS()
      window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => {
      cleanup()
    })

    return {
      cartItems,
      totalAmount,
      removeItem
    }
  }
}
</script>

<style scoped>
.cart-page {
  background-color: #060c21;
  min-height: 100vh;
  font-family: 'Oswald', sans-serif;
  padding: 25px;
  position: relative;
  overflow: hidden;
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
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 2px solid #fff;
  border-radius: 12px;
  background-color: #1a1a40;
  padding: 10px;
}

.router-link-active.btn-success {
  text-decoration: none;
  color: white;
}
</style>

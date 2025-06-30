<template>
  <div class="place-order container py-5 text-light">
    <canvas id="three-bg"></canvas>
    
    <div class="order-confirmation text-center">
      <h1 class="text-white  mb-4">Order Placed Successfully!</h1>
      
      <div class="gif-container mb-4">
        <img
  src="https://static.wixstatic.com/media/3ad450_ffe60bd6ab114199b50bed5a9efde163~mv2.gif"
  alt="Order Confirmed"
  class="order-gif"
/>
      </div>
      
      <p class="confirmation-text">Your order has been processed successfully.</p>
      <p class="confirmation-text">Thank you for your purchase!</p>
      
      <div class="mt-5">
        <button class="btn btn-continue" @click="goBack">Continue Shopping</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'PlaceOrder',
  methods: {
   goBack() {
  this.$router.push({ name: 'Home' }) // navigates to HomePage.vue
},
    initThreeBackground() {
      const canvas = document.getElementById('three-bg')
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x060c21, 1)

      const particleCount = 400
      const geometry = new THREE.BufferGeometry()
      const positions = []

      for (let i = 0; i < particleCount; i++) {
        positions.push((Math.random() - 0.5) * 10)
        positions.push((Math.random() - 0.5) * 10)
        positions.push((Math.random() - 0.5) * 10)
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

      const material = new THREE.PointsMaterial({
        color: 0xe91e63,
        size: 0.05,
        transparent: true,
        opacity: 0.8
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      const animate = () => {
        requestAnimationFrame(animate)
        particles.rotation.y += 0.001
        particles.rotation.x += 0.001
        renderer.render(scene, camera)
      }

      animate()

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })
    }
  },
  mounted() {
    this.initThreeBackground()
  }
}
</script>

<style scoped>
.place-order {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: auto;
  font-family: 'Oswald', sans-serif;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* .text-glow {
  color: #fff;
  text-shadow: 0 0 10px #e91e63, 0 0 20px #e91e63;
  font-size: 2.5rem;
  margin-bottom: 2rem;
} */

.order-confirmation {
  position: relative;
  z-index: 2;
  background-color: rgba(6, 12, 33, 0.85);
  padding: 2.5rem;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
}

.gif-container {
  margin: 0 auto;
  max-width: 400px;
}

.order-gif {
  width: 100%;
  border-radius: 10px;
  
}

.confirmation-text {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.btn-continue {
  background-color: #e91e63;
  color: white;
  font-size: 1.2rem;
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.btn-continue:hover {
  background-color: #ff4081;
  box-shadow: 0 0 20px rgba(233, 30, 99, 0.7);
  transform: translateY(-3px);
}

/* Animation for text */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.confirmation-text {
  animation: fadeIn 0.8s ease forwards;
}

.confirmation-text:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
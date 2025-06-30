<template>
  <div class="about-page">
    <canvas id="three-bg"></canvas>
    <NavBar />
    <div class="container py-5 content-wrapper">
      <h1 class="about-title text-center mb-4">About <span>Shoe Carnival</span></h1>
      <p class="about-description text-center mx-auto">
        Welcome to <strong>Shoe Carnival</strong> – your one-stop destination for premium and trendy footwear! 
        At Shoe Carnival, we blend comfort, style, and affordability to bring you the best collection of shoes 
        for every occasion. Whether you're stepping into the gym, office, or party – we've got you covered.
      </p>

      <div class="about-highlights row mt-5">
        <div class="col-md-4 mb-4">
          <div class="highlight-card p-4 rounded-4 text-center">
            <h4>🔥 Trendy Designs</h4>
            <p>Explore a wide range of modern, fashion-forward designs for men, women, and kids.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="highlight-card p-4 rounded-4 text-center">
            <h4>💯 Quality & Comfort</h4>
            <p>Every pair is crafted with care to offer you lasting comfort and superior quality.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="highlight-card p-4 rounded-4 text-center">
            <h4>🚚 Fast Delivery</h4>
            <p>Get your shoes delivered quickly and safely with our trusted delivery partners.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import * as THREE from 'three'
import { markRaw } from 'vue'

export default {
  name: 'AboutPage',
  components: {
    NavBar
  },
  data() {
    return {
      threeScene: null,
      camera: null,
      renderer: null,
      stars: null,
      animationId: null
    }
  },
  mounted() {
    this.initThreeJSBackground()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    this.cleanupThreeJS()
  },
  methods: {
    initThreeJSBackground() {
      const canvas = document.getElementById("three-bg")
      this.threeScene = markRaw(new THREE.Scene())

      this.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ))
      this.camera.position.z = 5

      this.renderer = markRaw(new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      }))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setClearColor(0x060c21, 1)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      this.createParticles()
      this.animate()
    },

    createParticles() {
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

      const particles = markRaw(new THREE.Points(geometry, material))
      this.threeScene.add(particles)
      this.stars = particles
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate)
      if (this.stars) {
        const pos = this.stars.geometry.attributes.position.array
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
        this.stars.geometry.attributes.position.needsUpdate = true
      }

      this.renderer.render(this.threeScene, this.camera)
    },

    handleResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },

    cleanupThreeJS() {
      cancelAnimationFrame(this.animationId)
      window.removeEventListener('resize', this.handleResize)

      if (this.renderer) {
        this.renderer.dispose()
        this.renderer.forceContextLoss()
        const canvas = this.renderer.domElement
        canvas.width = 1
        canvas.height = 1
        this.renderer = null
      }

      if (this.stars) {
        this.stars.geometry.dispose()
        this.stars.material.dispose()
        this.stars = null
      }

      if (this.threeScene) {
        this.threeScene = null
      }

      this.camera = null
    }
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: #060c21;
  color: #ffffff;
  padding-top: 70px;
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

.about-title {
  font-size: 2.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.about-title span {
  color: #e91e63;
}

.about-description {
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.8;
  color: #d1d1d1;
}

.highlight-card {
  background-color: #121a34;
  color: #f8f9fa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.highlight-card h4 {
  color: #e91e63;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.highlight-card p {
  font-size: 0.95rem;
  color: #cbd3e2;
}
</style>

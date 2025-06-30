<template>
  <div class="place-order container py-5 text-light">
    <canvas id="three-bg"></canvas>

    <form @submit.prevent="submitOrder" class="order-form p-4">
      <h1 class="text-center mb-5 display-4 text-sucess ">Payment Checkout</h1>
      <div class="mb-3">
        <label for="name" class="form-label">Full Name</label>
        <input v-model="name" type="text" id="name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email Address</label>
        <input v-model="email" type="email" id="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Phone Number</label>
        <input v-model="phone" type="tel" id="phone" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">Shipping Address</label>
        <textarea v-model="address" id="address" class="form-control" rows="3" required></textarea>
      </div>

git commit -m "Initial commit"      <div class="mb-3">
        <label class="form-label">Payment Method</label>
        <select v-model="paymentMethod" class="form-select" required>
          <option disabled value="">Select a payment method</option>
          <option value="netbanking">Net Banking</option>
          <option value="upi">UPI</option>
          <option value="card">Credit / Debit Card</option>
        </select>
      </div>

      <transition name="slide-fade">
        <div v-if="paymentMethod === 'netbanking'" class="mb-3">
          <label class="form-label">Bank Name</label>
          <input v-model="bankName" type="text" class="form-control" required />
        </div>
      </transition>

      <transition name="slide-fade">
        <div v-if="paymentMethod === 'upi'" class="mb-3">
          <label class="form-label">UPI ID</label>
          <input v-model="upiId" type="text" class="form-control" placeholder="example@upi" required />
        </div>
      </transition>

      <transition name="slide-fade">
        <div v-if="paymentMethod === 'card'" class="mb-3">
          <label class="form-label">Card Number</label>
          <input
  v-model="cardNumber"
  type="text"
  class="form-control"
  placeholder="Enter 16-digit card number"
  maxlength="19"
  @input="cardNumber = cardNumber.replace(/[^0-9-]/g, '')"
  required
/>

        </div>
      </transition>

      <div class="text-end mt-4">
        <button class="btn btn-success px-4 py-2">Confirm Order</button>
      </div>
    </form>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'PlaceOrder',
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: '',
      bankName: '',
      upiId: '',
      cardNumber: ''
    }
  },
  methods: {
    submitOrder() {
      this.$router.push('/complete');
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
} */

.order-form {
  background-color: transparent;
  z-index: 2;
  position: relative;
  color: white;
}

input,
textarea,
select {
  background-color: rgba(6, 12, 33, 0.9);
  /* border: 1px solid #e91e63; */
  color: #fff;
  font-weight: 500;
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 10px #e91e63;
  border-color: #e91e63;
} */

/* .btn-success {
  background-color: #e91e63;
  border: none;
  transition: all 0.3s ease;
} */

/* .btn-success:hover {
  background-color: #ff4081;
  box-shadow: 0 0 12px #e91e63;
} */

/* Slide Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
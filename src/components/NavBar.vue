<template>
  <nav class="navbar">
    <router-link to="/" class="brand">Shoe<span>Carnival</span></router-link>
    <ul class="nav-links">
      <li><router-link to="/home">Home</router-link></li>
      <li><router-link to="/products">Products</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li>
        <router-link to="/cart">
          Cart  <span v-if="cartCount > 0">({{ cartCount }})</span>
        </router-link>
      </li>
      <li>
        <a href="#" @click.prevent="logout">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapState({
      cart: state => state.cart
    }),
    cartCount() {
      return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    }
  },
  methods: {
    logout() {
      this.$store.commit('setAuth', false)
      this.$store.commit('setUsername', '')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: #060c21;
  padding: 1rem 2rem;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
}

.brand {
  font-size: 1.5rem;
  color: #fff;
  font-family: 'Oswald', sans-serif;
}

.brand span {
  color: #e91e63;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links li a:hover {
  color: #e91e63;
}
</style>

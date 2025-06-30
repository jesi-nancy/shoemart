import { createStore } from 'vuex'

export default createStore({
  state: {
    username: '',
    isAuthenticated: false,
    cart: [] // Stores added products with quantity
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setAuth(state, status) {
      state.isAuthenticated = status
    },
    addToCart(state, product) {
      const existing = state.cart.find(item => item.id === product.id)
      if (existing) {
        existing.quantity += product.quantity || 1
      } else {
        state.cart.push({ ...product, quantity: product.quantity || 1 })
      }
    },
    removeFromCart(state, index) {
      state.cart.splice(index, 1)
    },
    clearCart(state) {
      state.cart = []
    }
  },
  actions: {
    addToCart({ commit }, product) {
      commit('addToCart', product)
    },
    removeFromCart({ commit }, index) {
      commit('removeFromCart', index)
    },
    clearCart({ commit }) {
      commit('clearCart')
    }
  },
  getters: {
    cartCount: state =>
      state.cart.reduce((total, item) => total + (item.quantity || 1), 0),
    cartItems: state => state.cart,
    totalAmount: state =>
      state.cart.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
  }
})

import { createRouter, createWebHashHistory } from 'vue-router'

// Component Imports
import LogIn from '@/components/LogIn.vue'
import HomePage from '@/components/HomePage.vue'
import AboutPage from '@/components/AboutPage.vue'
import ListComponent from '@/components/ListComponent.vue'
import CartPage from '@/components/CartPage.vue'
import ViewPage from '@/components/ViewPage.vue'
import PlaceOrder from '@/components/PlaceOrder.vue'
import CompleteProcess from '@/components/CompleteProcess.vue' // ✅ Newly added

const routes = [
  { path: '/', name: 'Login', component: LogIn },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/products', name: 'Products', component: ListComponent },
  { path: '/cart', name: 'Cart', component: CartPage },
  { path: '/view/:id', name: 'ViewPage', component: ViewPage, props: true },
  { path: '/placeorder', name: 'PlaceOrder', component: PlaceOrder },
  { path: '/complete', name: 'CompleteProcess', component: CompleteProcess } // ✅ New route
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

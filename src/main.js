import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' 
import 'bootstrap/dist/css/bootstrap.min.css'


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')

const app = createApp(App)

app.use(store)
app.use(router)  // ✅ This is required
app.mount('#app')
createApp(App).use(router).use(store).mount('#app')
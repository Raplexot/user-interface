import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/pages/Login.vue'
import Dashboard from '../components/pages/Dashboard.vue'
import Error from '../components/pages/Error.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/error', component: Error }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

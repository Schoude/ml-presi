import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Intro',
    component: () => import('../views/Intro.vue')
  },
  {
    path: '/linreg',
    name: 'LinearRegression',
    component: () => import('../views/LinearRegression.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

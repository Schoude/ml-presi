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
  {
    path: '/logreg',
    name: 'LogisticRegression',
    component: () => import('../views/LogisticRegression.vue')
  },
  {
    path: '/cat',
    name: 'Categorization',
    component: () => import('../views/Categorization.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomeComponent.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/components/Auth/AuthComponent.vue'),
      children: [
        {
          path: '/auth/register',
          name: 'register',
          component: () => import('@/components/Auth/RegisterComponent.vue')
        },
        {
          path: '/auth/login',
          name: 'login',
          component: () => import('@/components/Auth/LoginComponent.vue')
        },
      ]
    },
    {
      path: '/your-products',
      name: 'your-products',
      component: () => import('@/components/Product/YourProductsComponent.vue'),
      children: [
        {
          path: '/your-products/active',
          name: 'yourActiveProducts',
          component: () => import('@/components/Product/YourActiveProductsComponent.vue'),
        },
        {
          path: '/your-products/wait',
          name: 'yourWaitProducts',
          component: () => import('@/components/Product/YourWaitProductsComponent.vue'),
        },
        {
          path: '/your-products/not-active',
          name: 'yourNotActiveProducts',
          component: () => import('@/components/Product/YourNotActiveProductsComponent.vue'),
        },
        {
          path: '/your-products/reject',
          name: 'yourRejectProducts',
          component: () => import('@/components/Product/YourRejectProductsComponent.vue'),
        },
      ]
    },
    {
      path: '/create-products',
      name: 'createProducts',
      component: () => import('@/components/Product/CreateProductsComponent.vue'),
    }
  ]
})

export default router

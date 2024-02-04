import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomeComponent.vue'),
      children: [
        {
          path: '/product/:id',
          name: 'product',
          component: () => import('@/components/Product/ProductComponent.vue'),
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('@/components/MainComponent.vue'),
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('@/components/Product/SearchProductComponent.vue'),
        },
      ]
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
      component: () => import('@/components/Product/YourProducts/YourProductsComponent.vue'),
      children: [
        {
          path: '/your-products/active',
          name: 'yourActiveProducts',
          component: () => import('@/components/Product/YourProducts/YourActiveProductsComponent.vue'),
        },
        {
          path: '/your-products/wait',
          name: 'yourWaitProducts',
          component: () => import('@/components/Product/YourProducts/YourWaitProductsComponent.vue'),
        },
        {
          path: '/your-products/not-active',
          name: 'yourNotActiveProducts',
          component: () => import('@/components/Product/YourProducts/YourNotActiveProductsComponent.vue'),
        },
        {
          path: '/your-products/reject',
          name: 'yourRejectProducts',
          component: () => import('@/components/Product/YourProducts/YourRejectProductsComponent.vue'),
        },
      ]
    },
    {
      path: '/create-products',
      name: 'createProducts',
      component: () => import('@/components/Product/CreateProductsComponent.vue'),
    },
  ]
})

export default router

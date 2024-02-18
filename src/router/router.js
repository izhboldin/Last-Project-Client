import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomeComponent.vue'),
    },
    {
      path: '/testComp',
      name: 'testComp',
      component: () => import('@/components/testComp.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/components/Product/ProductComponent.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/components/Product/SearchProductComponent.vue'),
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
      meta: {
        requiresAuth: true,
      },
      name: 'your-products',
      component: () => import('@/components/Product/YourProducts/YourProductsComponent.vue'),
      children: [
        {
          path: '/your-products/active',
          meta: {
            requiresAuth: true,
          },
          name: 'yourActiveProducts',
          component: () => import('@/components/Product/YourProducts/YourActiveProductsComponent.vue'),
        },
        {
          path: '/your-products/wait',
          meta: {
            requiresAuth: true,
          },
          name: 'yourWaitProducts',
          component: () => import('@/components/Product/YourProducts/YourWaitProductsComponent.vue'),
        },
        {
          path: '/your-products/reject',
          meta: {
            requiresAuth: true,
          },
          name: 'yourRejectProducts',
          component: () => import('@/components/Product/YourProducts/YourRejectProductsComponent.vue'),
        },
      ]
    },
    {
      path: '/create-products',
      meta: {
        requiresAuth: true,
      },
      name: 'createProducts',
      component: () => import('@/components/Product/CreateProductsComponent.vue'),
    },
    {
      path: '/edit-products/:id',
      meta: {
        requiresAuth: true,
      },
      name: 'editProducts',
      component: () => import('@/components/Product/EditProductsComponent.vue'),
    },
    {
      path: '/chats',
      meta: {
        requiresAuth: true,
      },
      name: 'chats',
      component: () => import('@/components/Chat/ChatComponent.vue'),
    },
    {
      path: '/profile',
      meta: {
        requiresAuth: true,
      },
      name: 'profile',
      component: () => import('@/components/User/ProfileComponent.vue'),
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import('@/components/NotFoundComponent.vue'),
    },
  ],


});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.getIsToken) {
    router.push('/auth/login');
  } else if ((to.name === 'register' || to.name === 'login') && authStore.getIsToken) {
    router.push('/');
  } else {
    next();
  }
});


export default router
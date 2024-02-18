
<template>
  <section v-if="route.name !== 'register' && route.name !== 'login'">
    <HeaderView></HeaderView>
  </section>
  <section class="bg-light  h-100">
    <RouterView />
  </section>
</template>
<script setup>

import { ref, onMounted } from 'vue'
import HeaderView from './views/HeaderView.vue';
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js';

const { getDataUser } = useAuthStore();
const route = useRoute();
const name = ref('qwe')



onMounted(() => {
  getDataUser()
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
*{
  font-family: 'Open Sans', sans-serif;
}

</style>

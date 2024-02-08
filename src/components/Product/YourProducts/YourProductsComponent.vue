<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center">Ваши Объявления</h2>
        <div class="container mt-3 ">
            <div class="bg-body w-100 d-flex ">
                <router-link v-bind:class="{ 'fw-bolder border-dark': route.name === 'yourActiveProducts' }"
                    class="py-3 border-bottom fs-4 text-decoration-none text-dark w-50 text-center"
                    to="/your-products/active">Активные</router-link>
                <router-link v-bind:class="{ 'fw-bolder border-dark': route.name === 'yourWaitProducts' }"
                    class="py-3 border-bottom fs-4 text-decoration-none text-dark w-50 text-center"
                    to="/your-products/wait">Ожидающие</router-link>
                <router-link v-bind:class="{ 'fw-bolder border-dark': route.name === 'yourRejectProducts' }"
                    class="py-3 border-bottom fs-4 text-decoration-none text-dark w-50 text-center"
                    to="/your-products/reject">Отклоненные</router-link>
            </div>
            <div class="card-body p-2">
                <RouterView />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

const route = useRoute();
const router = useRouter()
const condition = ref(true);

</script>
<style lang="">
    
</style>
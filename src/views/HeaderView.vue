<template lang="">
        <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand" :to="{ name: 'products' }">buy-sale</router-link>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'product', params: { id: 123 } }">объявление</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'createProducts' }">Создание объявления</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'yourActiveProducts' }">Ваши объявления</router-link>
              </li>
              
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'login' }">Войти</router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-warning text-dark" href="#">Post a Free Ad</a>
              </li>
              <li class="nav-item">
                <span class="nav-link" v-if="getUser">Привет,  {{getUser.name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';

const router = useRouter()
const { getUser} = storeToRefs(useAuthStore());

</script>
<style lang="">
    /* body {
      background-color: --bs-light-rgb
    } */
</style>
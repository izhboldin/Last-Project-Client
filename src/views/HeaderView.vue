<template lang="">
        <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand" :to="{ name: 'home' }">buy-sale</router-link>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'createProducts' }">Создание объявления</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'yourActiveProducts' }">Ваши объявления</router-link>
              </li>
              
              <li v-if="!getUser" class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'login' }">Войти</router-link>
              </li>
              <li v-if="getUser" class="nav-item">
                <span class="nav-link" v-if="getUser">Привет, {{getUser.name}}</span>
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
const { getUser } = storeToRefs(useAuthStore());

</script>
<style lang="">
</style>
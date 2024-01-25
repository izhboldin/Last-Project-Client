<template lang="">
        <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="#">buy-sale</a>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'createProducts' }">createProduct</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'your-products' }">yourProduct</router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Sell</a>
              </li>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'login' }">login</router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-warning text-dark" href="#">Post a Free Ad</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>
<style lang="">
    
</style>
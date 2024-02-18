<template lang="">
        <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand" :to="{ name: 'home' }">buy-sell</router-link>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <template v-if="getUser">
                <li v-if="getUser.role == 'admin'" class="nav-item">
                  <a class="nav-link" href="http://localhost:8080/login">админка</a>
                </li>
              </template>
              <li class="nav-item">
                <router-link class="nav-link"
                :to="{ name: 'chats', query: {status: 'buyer'} }">Сообщения</router-link>
              </li>
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
                <router-link class="nav-link" :to="{ name: 'profile' }" v-if="getUser">Привет, {{getUser.name}}</router-link>
              </li>
              <li v-if="getUser" class="nav-item">
                <span class="nav-link btn" @click="thisLogout()" v-if="getUser">Выйти</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';

const router = useRouter()
const { getUser } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

watch(getUser, newValue => {
  if (newValue) {
    if (newValue.id) {

      Echo.channel(`pdf-create.${newValue.id}`)
      .listen('PdfCreate', (e) => {
        console.log(e.fileUrl);

          downloadURI(`http://localhost:8080/storage${e.fileUrl}`, "Pdf");


        });
    }
  }
})

const thisLogout = () => {
  logout()
  router.push({ name: 'home' })
}

const downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}


</script>
<style lang="">
</style>
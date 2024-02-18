<template>
    <form>
        <div class="form-group mb-2">
            <label for="email">Email:</label>
            <input type="email" class="form-control" placeholder="Enter your email" v-model="email">
            <span class="text-danger">{{ messageEmail }}</span>
        </div>
        <div class="form-group mb-2">
            <label for="password">Пароль:</label>
            <input type="password" class="form-control" placeholder="Enter your password" v-model="password">
            <span class="text-danger">{{ messagePassword }}</span>

        </div>
        <button type="button" class="btn btn-primary" @click="request(email, password)">Войти</button>
        <button type="button" class="btn btn-secondary ms-3" @click="router.push({ name: 'home' })">Главная</button>
        <!-- <button type="button" class="btn btn-secondary ms-3" @click="qwe()">button</button> -->
    </form>
</template>


<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js';
import { validationMixin } from '@/services/mixins/validationMixin';

const { getUser, getToken } = storeToRefs(useAuthStore());

const router = useRouter()
const { login, getDataUser } = useAuthStore();

const email = ref('');
const password = ref('');

const messageEmail = ref(null);
const messagePassword = ref(null);

watch(email, newValue => {
    return messageEmail.value = validationMixin.validEmail(newValue)
})
watch(password, newValue => {
    return messagePassword.value = validationMixin.validPassword(newValue)
})
watch(getToken, newValue => {
    router.push({ name: 'home' })
})


const request = (email, pass) => {
    if (email === '' || pass === '' || messageEmail.value !== null || messagePassword.value !== null) {
        return
    }
    
    const data = {
        'email': email,
        'password': pass,
    }
    login(data)
    // router.push({ name: 'home' })
}
</script>
<style lang="">
</style>
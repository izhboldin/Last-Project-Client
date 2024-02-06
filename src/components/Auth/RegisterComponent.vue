<template >
  <form>
    <div class="form-group mb-2">
      <label for="name">Имя (Логин):</label>
      <input type="text" class="form-control" placeholder="Enter your name" v-model="name">
      <span class="text-danger">{{ messageName }}</span>
    </div>
    <div class="form-group mb-2">
      <label for="email">Email:</label>
      <input type="email" class="form-control" placeholder="Enter your email" v-model="email">
      <span class="text-danger">{{ messageEmail }}</span>
    </div>
    <div class="form-group mb-2">
      <label for="phone" class="">Phone</label>
      <InputMask id="phone" v-model="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" class="form-control" />
      <span class="text-danger">{{ messagePhone }}</span>
    </div>
    <div class="form-group mb-2">
      <label for="password">Пароль:</label>
      <input type="password" class="form-control" placeholder="Enter your password" v-model="password">
      <span class="text-danger">{{ messagePassword }}</span>
    </div>
    <div class="form-group mb-3">
      <label for="confirmPassword">Повторите пароль:</label>
      <input type="password" class="form-control" placeholder="Confirm your password" v-model="passwordConf">
      <span class="text-danger">{{ messagePasswordConf }}</span>
    </div>
    <button type="button" class="btn btn-primary" @click="request(name, email, password, phone)">Отправить</button>
    <button type="button" class="btn btn-secondary ms-3" @click="router.push({ name: 'home' })">Главная</button>
    <span class="text-danger">{{ messageGlobal }}</span>
  </form>
  <!-- {{ getUser }}
  {{ getToken }} -->
</template>
<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js';
import { validationMixin } from '@/services/mixins/validationMixin.js';
import InputMask from 'primevue/inputmask';

const { getUser, getToken } = storeToRefs(useAuthStore());
const { register } = useAuthStore();
const router = useRouter()

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const passwordConf = ref('');

const messageName = ref(null);
const messageEmail = ref(null);
const messagePassword = ref(null);
const messagePasswordConf = ref(null);
const messagePhone = ref(null);
const messageGlobal = ref(null);


watch(name, newValue => {
  return messageName.value = validationMixin.validLogin(newValue)
})
watch(email, newValue => {
  return messageEmail.value = validationMixin.validEmail(newValue)
})
watch(password, newValue => {
  return messagePassword.value = validationMixin.validPassword(newValue)
})
watch(phone, newValue => {
  console.log(newValue);
  return messagePhone.value = validationMixin.validPhone(newValue)
})
watch(passwordConf, newValue => {
  if (validationMixin.isEmpty(newValue)) {
    return 'Заполните поле'
  }
  else if (password.value !== newValue) {
    return messagePasswordConf.value = 'Пароли не совпадают'
  } else {
    return messagePasswordConf.value = null
  }
})


const request = (name, email, pass, phone) => {
  if (name === '' || email === '' || pass === '' || phone === '') {
    return messageGlobal.value = 'заполните все поля'
  }
  if (messageName.value !== null || messageEmail.value !== null || messagePassword.value !== null || messagePasswordConf.value !== null || messagePhone.value !== null) {
    return messageGlobal.value = 'Проверте все полня на правильность введения'
  }
  messageGlobal.value = null;

  const data = {
    'name': name,
    'email': email,
    'phone': phone,
    'status': 'user',
    'password': pass,
    'role': 'user'
  }
  register(data);
  router.push({ name: 'home' })
}

</script>
<style lang="">
    
</style>
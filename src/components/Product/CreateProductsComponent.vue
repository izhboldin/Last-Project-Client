<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center pb-2">Cоздание Объявления</h2>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Укажите название</label>
                <div class="form-text">обязательно*</div>
                <input type="email" class="form-control">
            </div>
            <div class="mb-1">
                <label for="exampleInputPassword1" class="form-label">Укажите Категорию</label>
                <div class="form-text">обязательно*</div>
                <button type="button" class="form-control btn border" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Выбрать категорию</button>
            </div>
        </div>
        <div class="container bg-body p-4 mb-2">
            <h4 class="pb-2">Фото</h4>
        </div>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <div class="form-text">Описание*</div>
                <textarea type="text" class="form-control">{{ getUser }}</textarea>
            </div>
        </div>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-1">
                <div class="form-text">Местоположение*</div>
                <input type="text" class="form-control">
            </div>
        </div>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Контактная информация</label>
                <div class="form-text">Email-адрес</div>
                <input v-if="getUser" v-bind:value="getUser.email" type="text" class="form-control">
                <input v-if="!getUser" type="text" class="form-control">
            </div>
            <div class="mb-1">
                <div class="form-text">Номер телефона</div>
                <input type="text" class="form-control">
            </div>
        </div>

        <div class="container bg-body p-4">
            <button type="submit" class="btn btn-primary">отправить</button>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade modal-lg" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body row">
                    <button @click="parentId = 45">qwe {{ parentId }}</button>
                    <div class="row row-cols-3">
                        <div v-for="category in categories" class="col p-2 card">
                            <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                                alt="..." style="max-height: 15vh; object-fit: cover">
                            <div class="card-body p-1">
                                <h4 class="card-title text-center">{{ category.name }}</h4>
                            </div>
                            <div class="card-body d-flex justify-content-between p-1">
                                <a>{{ category.parent_category_id }}</a>
                                <a v-if="category.parent_category_id === null" >wqew</a>
                            </div>
                        </div>
                    </div>
                    <!-- <div v-for="category in getCategories" class="col">
                        <p class="my-5">{{ category.name }}</p>
                    </div> -->
                    <pre>
                        {{ categories }}
                    </pre>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { useCreateCategory } from '@/stores/createProduct.js';

const { getUser, getToken } = storeToRefs(useAuthStore());
const { getCategories } = storeToRefs(useCreateCategory());
const { getDataCategory } = useCreateCategory();
const route = useRoute();
const parentId = ref(null);
const categories = ref(getCategories);

watch(parentId, newValue => {
  categories.value = getCategories.filter(category => category.parent_category_id === newValue);
});

onMounted(() => {
    getDataCategory();
    console.log(getCategories);
});
</script>
<style></style>
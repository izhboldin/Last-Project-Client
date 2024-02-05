<template>
    <div class="bg-light w100 py-3">

        <div class="container my-2">
            <div class="input-group">
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" v-model="search">
                <button class="btn btn-info" type="button" id="button-addon2">Поиск</button>
            </div>
        </div>
    </div>
    <div class="w-100 bg-body mt-4">
        <div class="container">
            <div class="row g-3">

                <div v-for="category in categories" class="col-2">
                    <div class="p-3 text-center  bg-body">
                        <img src="https://ireland.apollo.olxcdn.com:443/v1/files/zo9y2rkxi8941-UA/image;s=1000x700"
                            class="img-fluid object-fit-cover rounded-circle" style="height: 120px; width: 120px;"
                            alt="...">
                        <h5 class="mt-2"><strong>{{ category.name }}</strong></h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button type="button" class="form-control btn border" data-bs-toggle="modal" data-bs-target="#exampleModal">Выбрать
        категорию</button>

    <div class="modal fade modal-lg" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <button class="btn btn-outline-primary btn-sm mb-2 w-100" v-if="parentId !== null || !isNaN(parentId)"
                        @click="getBack()">back</button>

                    <div v-if="currentCategory !== null" class="row g-2">

                        <div v-for="category in currentCategory" class="col-4 p-2 card">
                            <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                                alt="..." style="max-height: 20vh; object-fit: cover">
                            <div class="card-body p-1">
                                <h4 class="card-title text-center">{{ category.name }}</h4>
                            </div>
                            <div class="card-body d-flex justify-content-between p-1">
                                <button v-if="category.children.length !== 0" class="btn btn-outline-primary btn-sm"
                                    @click="receive(category.children, category.parent_category_id)">Далее</button>
                                <button v-if="category.parent_category_id !== null && category.children.length === 0"
                                    class="btn btn-outline-success btn-sm" @click="getDataCategory(category.id)"
                                    aria-label="Close" data-bs-dismiss="modal">Выбрать</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import axiosInstance from '@/services/axios.js';
import { productValidMixin } from '@/services/mixins/productValidMixin.js';


const categories = ref('');

const getAllCategories = async () => {
    try {
        let result = await axiosInstance.get(`api/categories`);
        if (result.data.length === 0) {
            return
        }
        categories.value = result.data.data;
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {

    getAllCategories();
});
</script>
<style></style>
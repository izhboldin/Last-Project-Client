<template>
    <div class="bg-light w100 py-3">

        <div class="container my-2">
            <div class="input-group">
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" v-model="search">
                <button class="btn btn-info" type="button"
                    @click="router.push({ name: 'search', query: { 'search': search } })">Поиск</button>
            </div>
        </div>
        <div class="w-100 bg-body mt-5 mb-3">
            <div class="container">
                <h2 class="text-center p-2">Разделы на категории </h2>
                <div class="row g-3">
                    <div v-for="category in categories" class="col-2">
                        <div class="p-3 text-center  bg-body cursor-pointer"
                            @click="router.push({ name: 'search', query: { 'categoryId': category.id } })">
                            <img src="https://ireland.apollo.olxcdn.com:443/v1/files/zo9y2rkxi8941-UA/image;s=1000x700"
                                class="img-fluid object-fit-cover rounded-circle" style="height: 120px; width: 120px;"
                                alt="...">
                            <h6 class="mt-2"><strong>{{ category.name }}</strong></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="products" class="container">
                <h2>Недавно созданные Объявления</h2>
                <!-- <pre>{{ products }}</pre> -->
                <div class="row g-2">

                    <div v-for="product in products.data" class="col-3 my-3">
                        <div @click="router.push({ name: 'product', params: { id: product.id } })"
                            class="cursor-pointer p-3 bg-body">
                            <img src="https://i.redd.it/ux74bsifrpda1.jpg" class="card-img" alt="..."
                                style="max-height: 30vh; object-fit: cover">
                                <small class="py-2 blockquote-footer">{{ product.category.name }}</small>
                            <h4 class="py-2 ">{{ product.title }}</h4>
                            <h6><strong>{{ product.price }} грн.</strong></h6>

                        </div>
                    </div>
                    <h4 class="text-center p-5" v-if="!products.data || !products.data.length">Объявления не найдены</h4>

                    <div class="">
                        <Paginator v-model:first="paginate" :rows="products.per_page" :totalRecords="products.total"></Paginator>
                        <!-- {{ paginate }} -->
                    </div>

                </div>
            </div>


    </div>
    <!-- <button type="button" class="form-control btn border" data-bs-toggle="modal" data-bs-target="#exampleModal">Выбрать
        категорию</button> -->

    <!-- <div class="modal fade modal-lg" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
    </div> -->
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import axiosInstance from '@/services/axios.js';
import { productValidMixin } from '@/services/mixins/productValidMixin.js';


const { getUser, getToken } = storeToRefs(useAuthStore());

const categories = ref('');
const products = ref(null);

const router = useRouter();

const getAllCategories = async () => {
    try {
        let result = await axiosInstance.get(`api/categories`);
        if (result.data.length === 0) {
            return
        }
        categories.value = result.data;
        console.log(categories.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getProducts = async () => {
    try {
        let result = await axiosInstance.get(`api/products?date=desc`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        products.value = result.data;

        console.log(result.data);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getProducts();
    getAllCategories();
});
</script>
<style>
.cursor-pointer {
    cursor: pointer;
}
</style>
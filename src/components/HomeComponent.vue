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
                        <!-- <pre>{{ category }}</pre> -->
                        <div class="p-3 text-center  bg-body cursor-pointer"
                            @click="router.push({ name: 'search', query: { 'categoryId': category.id } })">

                            <img v-if="category.image" v-bind:src="category.image.full_url"
                                class="img-fluid object-fit-cover rounded-circle" style="height: 120px; width: 120px;"
                                alt="...">

                            <img v-if="!category.image" src="http://localhost:8080/storage/images/no_image_available.png"
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
                            <img v-if="product.images[0]" v-bind:src="product.images[0].full_url" class="card-img" alt="..."
                                style="height: 26vh; object-fit: cover">
                            <img v-if="!product.images[0]" src="http://localhost:8080/storage/images/no_image_available.png" class="card-img" alt="..."
                                style="height: 26vh; object-fit: cover">
                        <small class="py-2 blockquote-footer">{{ product.category.name }}</small>
                        <h4 class="py-2 ">{{ product.title }}</h4>
                        <h6><strong>{{ product.price }} грн.</strong></h6>

                    </div>
                </div>
                <h4 class="text-center p-5" v-if="!products.data || !products.data.length">Объявления не найдены</h4>

                <div class="">
                    <Paginator v-model:first="paginate" :rows="products.per_page" :totalRecords="products.total">
                    </Paginator>
                    <!-- {{ paginate }} -->
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
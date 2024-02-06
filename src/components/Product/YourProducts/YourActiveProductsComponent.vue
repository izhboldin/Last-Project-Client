<template>
    <div>
        <div v-if="products === null" class="text-center pt-3">загрузка</div>
        <div v-if="products !== null && products.length == 0" class="text-center pt-3">Объявлений нет</div>

        <div v-for="product in products" class="bg-body p-3  mb-3 w-100">
            <div class="row g-0 justify-content-center">

                <div class="col-md-4">
                    <img src="https://ireland.apollo.olxcdn.com:443/v1/files/zo9y2rkxi8941-UA/image;s=1000x700"
                        class="img-fluid rounded object-fit-cover m-1" style="width: 30vh; height: 15vh" alt="...">
                </div>

                <div class="col-md-8">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h4 class="card-title">{{ product.title }}</h4>
                            <h6 class="card-title">Цена: {{ product.price }}</h6>
                        </div>
                        <p class="card-text my-1"></p>
                        <p class="card-text my-1"><small class="text-muted">Категория: {{ product.category.name }}</small></p>
                        <p class="card-text my-1 d-flex">
                        <div class="d-flex align-items-center" v-for="option in product.options">
                            <span class="material-symbols-outlined">chevron_right</span>
                            <small class="text-muted">{{ option.parameter.name }}: {{ option.name }}. </small>
                        </div>
                        </p>


                    </div>
                </div>

                <div class="row d-flex justify-content-between py-2">

                    <div class="col-3">
                        qwe
                    </div>
                    <div class="col-3">
                        dasdas
                    </div>
                    <button class="btn border col-3 btn-outline-info"
                        @click="router.push({ name: 'product', params: { id: product.id } })">Подробнее</button>
                </div>

            </div>
        </div>



    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';

const { getUser, getToken } = storeToRefs(useAuthStore());
const router = useRouter();

const products = ref(null);

const getProduct = async () => {
    try {
        let result = await axiosInstance.get(`api/products?str=active`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        products.value = result.data;

        console.log(products.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getProduct();
})
</script>
<style>
</style>
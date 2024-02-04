<template>
    <div v-if="categories" class="w-100  mt-4">
        <div class="container">
            <h4><strong>Фильтры</strong></h4>
            <div class="row g-3">

                <div class="col-3">
                    <div class="p-3 ">
                        <label for="exampleInputEmail1" class="form-label">Категория</label>
                        <button v-if="!(route.query.categoryId)" class="form-control">Все категории</button>
                        <button v-if="(route.query.categoryId)" class="form-control">{{ categories.name }}</button>
                    </div>
                </div>
                <div class="col-3">
                    <label for="exampleInputEmail1" class="form-label">Цена</label>
                    <div class="p-3  input-group">
                        <input type="text" class="form-control" placeholder="От:">
                        <input type="text" class="form-control" placeholder="До:">
                    </div>
                </div>
                <div v-for="parameter in categories.parameters" class="col-3">
                    <label for="exampleInputEmail1" class="form-label">{{ parameter.name }}</label>
                    <div class="p-3  input-group">
                        <select v-if="parameter.type == 'select'" class="form-control">
                            <option value="" selected>-</option>
                            <option v-for="option in parameter.options" :value="option.id">{{ option.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="border-bottom mb-3"></div>
        <div class="container">
            <div class="row g-2">

                <div v-for="product in products" class="col-3 ">
                    <div class="p-3 bg-body">
                        <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                            alt="..." style="max-height: 20vh; object-fit: cover">
                        <h5 class="py-2">{{ product.title }}</h5>
                        <h6>{{ product.price }} грн.</h6>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <h3 class="text-center" v-if="!categories">404</h3>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { format } from 'date-fns';

const { getToken } = storeToRefs(useAuthStore());

const route = useRoute();


const categories = ref(null);
const products = ref(null);

const getCategories = async (data = null) => {
    try {
        let query = '';
        if (data) {
            query = `/${data}`
        }
        console.log(query);
        let result = await axiosInstance.get(`api/categories${query}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        data ? categories.value = result.data.data : categories.value = result.data
        console.log(categories.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getProducts = async (data = null) => {
    try {
        let query = '';
        if (data) {
            query += `?`
            if (data.categoryId) {
                query += `categoryId=${data.categoryId}&`
            }
            if (data.search) {
                query += `search=${data.search}&`
            }
            if (data.options) {
                query += `options=${data.options}&`
            }
            // console.log(query);
        }
        let result = await axiosInstance.get(`api/products${query}`, {
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
    getCategories(route.query.categoryId)
    getProducts(
        {
            'categoryId': route.query.categoryId,
            'search': route.query.search,
            'options': route.query.options,
        })
})

</script>
<style></style>
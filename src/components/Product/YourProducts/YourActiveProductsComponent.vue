<template>
    <div>
        <div v-if="products === null" class="text-center pt-3">загрузка</div>
        <div v-if="products !== null && products.length == 0" class="text-center pt-3">Объявлений нет</div>

        <div v-for="product in products" class="bg-body p-3  mb-3 w-100">
            <div class="row g-0 justify-content-center">

                <div class="col-md-4">
                    <img v-if="product.images[0]" v-bind:src="product.images[0].full_url"
                        class="img-fluid rounded object-fit-cover m-1" style="width: 30vh; height: 15vh" alt="...">
                    <img v-if="!product.images[0]" src="http://localhost:8080/storage/images/no_image_available.png"
                        class="img-fluid rounded object-fit-cover m-1" style="width: 30vh; height: 15vh" alt="...">

                </div>

                <div class="col-md-8">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h4 class="card-title">{{ product.title }}</h4>
                            <h6 class="card-title">Цена: {{ product.price }}</h6>
                        </div>
                        <p class="card-text my-1"></p>
                        <p class="card-text my-1"><small class="text-muted">Категория: {{ product.category.name }}</small>
                        </p>
                        <p class="card-text my-1 d-flex">
                        <div class="d-flex align-items-center" v-for="option in product.options">
                            <span class="material-symbols-outlined">chevron_right</span>
                            <small class="text-muted">{{ option.parameter.name }}: {{ option.name }}. </small>
                        </div>
                        </p>


                    </div>
                </div>

                <div class="row d-flex justify-content-between py-2">

                    <button type="button" class="btn btn-outline-danger col-3" data-bs-toggle="modal"
                        @click="createDeleteId(product.id)" data-bs-target="#exampleModal">Удалить</button>
                    <button type="button" class="btn col-3 btn-outline-warning"
                        @click="router.push({ name: 'editProducts', params: { id: product.id } })">Изменить</button>
                    <button type="button" class="btn col-3 btn-outline-info"
                        @click="router.push({ name: 'product', params: { id: product.id } })">Подробнее</button>
                </div>

            </div>
        </div>



        <!-- Модальное окно -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Удаление объявления</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <p>Вы уверены что хотите удалить это объявление?</p>
                        <button class="btn btn-outline-danger" @click="deleteProduct(deleteProductId)"
                            data-bs-dismiss="modal" aria-label="Закрыть">Удалить</button>
                    </div>
                </div>
            </div>
        </div>



    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const { getUser, getToken } = storeToRefs(useAuthStore());
const router = useRouter();

const products = ref(null);
const deleteProductId = ref(null);

const createDeleteId = (id) => {
    deleteProductId.value = id;
}

watch(getUser, () => {
    getProduct();
})
const getProduct = async () => {
    try {
        let result = await axiosInstance.get(`api/products?str=active&userId=${getUser.value.id}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        products.value = result.data.data;

    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const deleteProduct = async (data) => {
    try {
        let result = await axiosInstance.delete(`api/products/${data}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        getProduct();
        toast.success("Объявление успешно удалено!", {
            autoClose: 2000,
        });

    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}
onMounted(() => {
    if (getUser.value) {
        getProduct();
    }
})
</script>
<style></style>
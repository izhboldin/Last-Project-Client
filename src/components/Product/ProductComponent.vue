<template>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Жалоба на объявление</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label class="mb-1">Виберите причину жалобы:</label>
                    <select v-model="reasonСomplaint" class="form-control mb-2">
                        <option value="Неподходящий контент">Неподходящий контент</option>
                        <option value="Нарушение правил">Нарушение правил</option>
                        <option value="Неправильная категория">Неправильная категория</option>
                        <option value="Другое">Другое</option>
                    </select>
                    <label class="mb-1">Подробно опишите причину жалобы:</label>
                    <textarea v-model="descriptionСomplaint" type="text" class="form-control"></textarea>
                    <span class="text-danger">{{ messageText }}</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-primary" @click="checkData()">Отправить жалобу</button>
                </div>
            </div>
        </div>
    </div>

    <div class="py-4">
        <div class="container pb-4">
            <div class="input-group">
                <button class="btn btn-secondary" type="button" @click="router.back()">Назад</button>
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" v-model="search">
                <button class="btn btn-info" type="button"
                    @click="router.push({ name: 'search', query: { 'search': search } })">Поиск</button>
            </div>
        </div>
        <div class="container">
            <template v-if="!product">
                <h1 class="bg-body w-100 d-flex align-items-center justify-content-center" style="height: 60vh;">
                    Загрузка
                </h1>
            </template>
            <template v-if="product">
                <template v-if="!product.id">
                    <h1 class="bg-body w-100 d-flex align-items-center justify-content-center" style="height: 60vh;">
                        Объявление не найдено
                    </h1>
                </template>

                <div class="row g-3">

                    <div class="col-8">
                        <div class="p-3 bg-body mb-3">
                            <template v-if="product.images">
                                <template v-if="product.images.length == 0 && product.id">

                                    <div class="p-3 text-center">
                                        <div style="height: 44vh;">
                                            <div class="d-flex align-items-center justify-content-center w-100 h-100 ">
                                                <span class="material-symbols-outlined">image</span>
                                            </div>
                                        </div>
                                        <!-- <img src="http://localhost:8080/storage/images/no_image_available.png"
                                    class="img-fluid rounded object-fit-cover" style="height: 44vh;" alt=""> -->
                                    </div>
                                </template>

                                <template v-if="!product.images.length == 0">
                                    <div class="p-3 text-center">
                                        <Image :src="product.images[first].full_url" alt="Image" height="420" preview />
                                    </div>

                                    <Paginator v-model:first="first" :rows="1" :totalRecords="product.images.length"
                                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                                </template>
                            </template>
                            <div>
                            </div>
                        </div>
                        <template v-if="product.category">

                            <div class="p-3 bg-body">
                                <small class="py-2 blockquote-footer">{{ product.category.name }}</small>
                                <div class="mb-4">
                                    <h4><strong>Описание</strong></h4>
                                    <p>{{ product.description }}</p>

                                </div>
                                <div v-if="product.options.length">
                                    <h4><strong>Параметры</strong></h4>
                                    <p class="card-text my-1 d-flex flex-wrap">
                                    <div class="d-flex align-items-center bg-light p-2 me-2 mb-2"
                                        v-for="option in product.options">
                                        <span class="material-symbols-outlined">chevron_right</span>
                                        <small class="text-muted">{{ option.parameter.name }}: {{ option.name }}. </small>
                                    </div>
                                    </p>
                                </div>
                            </div>
                        </template>

                    </div>
                    <template v-if="product.user">

                        <div class="col-4">
                            <div class="p-3 bg-body mb-3">
                                <p class="text-center"><small class="text-muted">Дата публикации: {{ format(new
                                    Date(product.created_at), "yyyy-MM-dd") }}</small></p>
                                <h5>{{ product.title }}</h5>
                                <h4><strong>{{ product.price }} грн.</strong></h4>
                                <template v-if="getUser">
                                    <button v-if="product.user.id !== getUser.id" class="btn btn-outline-info w-100 mb-2"
                                        type="button" @click="getOrCreateChat()">Написать</button>
                                </template>
                                <button class="btn btn-outline-info w-100 mb-2" type="button" @click="showPhone()">{{
                                    messagePhoneValue }}</button>
                                <!-- <template v-if="getUser">
                                    <button v-if="product.user.id !== getUser.id" class="btn btn-info w-100"
                                        type="button">Купить</button>
                                </template> -->
                            </div>
                            <!-- <div class="p-3 bg-body mb-3">
                                <h5><strong>Способи доставки</strong></h5>
                                <h6 class="my-1">Новая почта</h6>
                                <h6 class="my-1">Укр почта</h6>

                            </div> -->
                            <div class="p-3 bg-body">
                                <h5><strong>Пользователь</strong></h5>
                                <div class="d-flex m-2">

                                    <img v-if="product.user.image" v-bind:src="product.user.image.full_url"
                                        style="height: 54px; width: 54px;" alt=""
                                        class="img-fluid object-fit-cover rounded-circle me-2">
                                    <img v-if="!product.user.image"
                                        src="http://localhost:8080/storage/images/no-user-image.webp"
                                        style="height: 54px; width: 54px;" alt=""
                                        class="img-fluid object-fit-cover rounded-circle me-2">

                                    <h6 class="my-3 w-100">{{ product.user.name }}</h6>
                                    <div class="w-100 d-flex justify-content-end">
                                        <template v-if="getUser">
                                            <IconEnvelope v-if="product.user.id !== getUser.id" data-bs-toggle="modal"
                                                data-bs-target="#exampleModal" class="cursor-pointer"
                                                style="width: 20px; height: 20px;">
                                            </IconEnvelope>
                                        </template>
                                    </div>
                                </div>
                                <p class=""><small class="text-muted">На сайте с {{ format(new
                                    Date(product.user.created_at),
                                    "yyyy-MM-dd") }}</small></p>
                                <!-- <button class="btn btn-outline-info w-100 mb-2" type="button">Написать</button> -->

                            </div>
                        </div>
                    </template>

                    <div v-if="!product" class="py-5 text-center">
                        товар отсутствует
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { format } from 'date-fns';

import IconEnvelope from '@/components/icons/IconEnvelope.vue';
import Image from 'primevue/image';
import Paginator from 'primevue/paginator';
const first = ref(0);

import { validationMixin } from '@/services/mixins/validationMixin.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const { getUser, getToken } = storeToRefs(useAuthStore());
const route = useRoute();
const router = useRouter();

const reasonСomplaint = ref("Неподходящий контент");
const descriptionСomplaint = ref(null);

const product = ref(null);
const search = ref(null);

const messagePhoneValue = ref('Показать телефон')
const messageText = ref(null)


watch(descriptionСomplaint, newValue => {
    return messageText.value = validationMixin.validText(newValue);
})

const checkData = () => {

    if (messageText.value != null && descriptionСomplaint.value == '') {
        return
    }

    let data = {
        'text': descriptionСomplaint.value,
        'reason': reasonСomplaint.value,
        'complainant_user_id': getUser.value.id,
        'reported_user_id': product.value.user.id,
        'product_id': route.params.id,
        'status': 'wait',
        'type': 'product',
    }
    createСomplaint(data);
}

const showPhone = () => {
    messagePhoneValue.value = getUser.value.phone;
}

const getOrCreateChat = async () => {
    try {
        let result = await axiosInstance.get(`api/chats/get-or-create?sellerId=${product.value.user.id}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        })
        router.push({ name: "chats", query: { status: 'buyer', chatId: result.data.data.id } })

    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const createСomplaint = async (data) => {
    try {
        let result = await axiosInstance.post(`api/complaints`, data, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        toast.success("Жалоба успешно отправлена!", {
            autoClose: 2000,
        });
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

}

const getProduct = async (data) => {
    try {
        let result = await axiosInstance.get(`api/products/${data}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        if (result.data.data.status == 'active') {
            product.value = result.data.data;
        }
        else if (getUser.value && result.data.data.user.id == getUser.value.id) {
            product.value = result.data.data;
        } else {
            product.value = [];
        }
    } catch (error) {
        product.value = [];
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getProduct(route.params.id);
})
</script>
<style></style>
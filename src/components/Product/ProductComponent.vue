<template>
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
            <div v-if="product" class="row g-3">

                <div class="col-8">
                    <div class="p-3 bg-body mb-3">
                        <div>
                            <img src="https://ireland.apollo.olxcdn.com:443/v1/files/ygmhic4pl14b-UA/image;s=1000x667"
                                class="img-fluid rounded object-fit-cover" style="max-height: 60vh;" alt="">
                        </div>
                    </div>
                    <div class="p-3 bg-body">
                        <small class="py-2 blockquote-footer">{{ product.category.name }}</small>
                        <div class="mb-4">
                            <h4><strong>Описание</strong></h4>
                            <p>{{ product.description }}</p>

                        </div>
                        <div v-if="product.options.length">
                            <h4><strong>Параметры</strong></h4>
                            <p class="card-text my-1 d-flex flex-wrap">
                            <div class="d-flex align-items-center bg-light p-2 me-2 mb-2" v-for="option in product.options">
                                <span class="material-symbols-outlined">chevron_right</span>
                                <small class="text-muted">{{ option.parameter.name }}: {{ option.name }}. </small>
                            </div>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <div class="p-3 bg-body mb-3">
                        <p class="text-center"><small class="text-muted">Дата публикации: {{ format(new
                            Date(product.created_at), "yyyy-MM-dd") }}</small></p>
                        <h5>{{ product.title }}</h5>
                        <h4><strong>{{ product.price }} грн.</strong></h4>
                        <template v-if="getUser">
                            <button v-if="product.user.id !== getUser.id" class="btn btn-outline-info w-100 mb-2" type="button"
                                @click="getOrCreateChat()">Написать</button>
                        </template>
                        <button class="btn btn-outline-info w-100 mb-2" type="button"
                        @click="showPhone()">{{ messagePhoneValue }}</button>
                        <template v-if="getUser">
                                <button v-if="product.user.id !== getUser.id" class="btn btn-info w-100" type="button">Купить</button>
                        </template>
                    </div>
                    <div class="p-3 bg-body mb-3">
                        <h5><strong>Способи доставки</strong></h5>
                        <h6 class="my-1">Новая почта</h6>
                        <h6 class="my-1">Укр почта</h6>

                    </div>
                    <div class="p-3 bg-body">
                        <h5><strong>Пользователь</strong></h5>
                        <div class="d-flex m-2">
                            <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                style="height: 36px; width: 36px;" alt=""
                                class="img-fluid object-fit-cover rounded-circle me-2">
                            <h6 class="my-1">{{ product.user.name }}</h6>
                        </div>
                        <p class=""><small class="text-muted">На сайте с {{ format(new Date(product.user.created_at),
                            "yyyy-MM-dd") }}</small></p>
                        <!-- <button class="btn btn-outline-info w-100 mb-2" type="button">Написать</button> -->

                    </div>
                </div>

                <div v-if="!product" class="py-5 text-center">
                    товар отсутствует
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
import { format } from 'date-fns';

const { getUser, getToken } = storeToRefs(useAuthStore());
const route = useRoute();
const router = useRouter();

const product = ref(null);
const search = ref(null);
const messagePhoneValue = ref('Показать телефон')
// const id = ref(route.params.id);

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
        console.log(result.data.data);

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
        product.value = result.data.data;

        console.log(product.value);
        console.log(product.value.user.id);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getProduct(route.params.id);
})
</script>
<style></style>
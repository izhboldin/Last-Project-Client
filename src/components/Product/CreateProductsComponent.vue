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
                <button v-if="category === null" type="button" class="form-control btn border" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Выбрать категорию</button>

                <div v-if="category !== null" class="card" style="width: 24rem;">
                    <img src="..." class="card-img-top" alt="...">
                    <div class="card-body p-2">
                        <h5 class="card-title text-center">{{ category.name }}</h5>
                        <button type="button" class="form-control btn border" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">Изменить</button>
                    </div>
                </div>
                <pre>{{ category }}</pre>
            </div>
            <pre>
                    <!-- {{ currentCategory }} -->
                </pre>
        </div>

        <div class="container bg-body p-4 mb-2">
            <h5 class="pb-2">Фото</h5>
        </div>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <div class="form-text">Описание*</div>
                <textarea type="text" class="form-control"></textarea>
            </div>
        </div>

        <div v-if="category !== null" class="container bg-body p-4 mb-2">
            <div class="form-text">Цена*</div>
            <div class="input-group mb-3">
                <span class="input-group-text">грн</span>
                <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
            </div>
        </div>

        <div v-if="category !== null" class="container bg-body p-4 mb-2">
            <h5 for="exampleInputPassword1" class="form-label">Дополнительная информация</h5>
            <div v-for="parameter in category.parameters" class="mb-3">
                <div class="form-text">{{ parameter.name }}</div>
                <select v-if="parameter.type == 'select'" type="text" class="form-control">
                    <option v-for="option in parameter.options">{{ option.name }}</option>
                </select>
                <div v-if="parameter.type == 'multiselect'" class="card flex justify-content-center">
                    <MultiSelect v-model="multiselectValue[parameter.id]" :options="parameter.options" optionLabel="name"
                        :placeholder="parameter.options[0].name" :maxSelectedLabels="30" class="w-full md:w-20rem" />
                </div>
            </div>
            <pre>
                    {{ multiselectValue }}
                </pre>
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
                <InputMask id="phone" class="form-control" v-model="phone" mask="(999) 999-9999"
                    placeholder="(999) 999-9999" />
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
                    <button class="btn btn-outline-primary btn-sm mb-2" v-if="parentId !== null || !isNaN(parentId)"
                        @click="getBack()">back</button>

                    <div v-if="currentCategory !== null" class="row row-cols-3">

                        <div v-for="category in currentCategory" class="col p-2 card">
                            <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                                alt="..." style="max-height: 20vh; object-fit: cover">
                            <div class="card-body p-1">
                                <h4 class="card-title text-center">{{ category.name }}</h4>
                            </div>
                            <div class="card-body d-flex justify-content-between p-1">
                                <button v-if="category.children.length !== 0" class="btn btn-outline-primary btn-sm"
                                    @click="receive(category.children, category.parent_category_id)">Далее {{ category.id
                                    }}</button>
                                <button v-if="category.parent_category_id !== null" class="btn btn-outline-success btn-sm"
                                    @click="getDataCategory(category.id)" aria-label="Close"
                                    data-bs-dismiss="modal">Выбрать</button>

                            </div>
                        </div>

                    </div>

                    <pre>
                        <!-- {{ categories.length > 0 ? categories[0]["parent_category_id"] : 'Нет категорий' }} -->

                        <!-- {{ categories[0]?["parent_category_id"]  }} -->
                    </pre>
                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { useForCategory } from '@/stores/forCategories.js';
import axiosInstance from '@/services/axios.js';

import MultiSelect from 'primevue/multiselect';
const multiselectValue = ref({});
const cities = ref([
    { name: 'New York'},
    { name: 'Rome'},
    { name: 'London'},
    { name: 'Istanbul'},
    { name: 'Paris'}
]);
import InputMask from 'primevue/inputmask';
const phone = ref(null);

const { getUser } = storeToRefs(useAuthStore());
const route = useRoute();
const parentId = ref(null);
const currentParentId = ref(null);
const categories = ref(null);
const currentCategory = ref(null);
const category = ref(null);

const getAllCategories = async () => {
    try {
        let result = await axiosInstance.get(`api/categories`);
        if (result.data.length === 0) {
            return
        }
        categories.value = result.data.data;
        currentCategory.value = result.data.data;
        console.log(result.data);
        console.log(categories.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getDataCategory = async (data) => {
    try {
        let result = await axiosInstance.get(`api/categories/${data}`);
        if (result.data.length === 0) {
            return
        }
        category.value = result.data.data;
        console.log(result.data);
        console.log(category.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const receive = (category, parId) => {
    currentCategory.value = category;
    parId == null ? parentId.value = 0 : parentId.value = parId;
};


const getBack = () => {
    if (parentId.value == 0) {
        return currentCategory.value = categories.value;
    }
    categories.value.forEach(category => {
        if (category.children) {
            currentParentId.value = category.parent_category_id
            searchCategories(category.children);
        }
    });
}

const searchCategories = (categories) => {
    categories.forEach(category => {
        if (category.parent_category_id == parentId.value) {
            currentCategory.value = categories;
            currentParentId.value === null ? parentId.value = 0 : parentId.value = currentParentId.value;
            return 0;
        }
        if (category.children) {
            console.log(category);
            currentParentId.value = category.parent_category_id
            searchCategories(category.children);
        }
    });
}
onMounted(() => {
    getAllCategories();
});
</script>
<style></style>
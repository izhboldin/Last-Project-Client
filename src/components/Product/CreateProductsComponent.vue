<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center pb-2">Cоздание Объявления</h2>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Укажите название</label>
                <div class="form-text">обязательно*</div>
                <input type="email" class="form-control">
            </div>
            <pre>
                {{ categories }}
            </pre>

            <div class="mb-1">
                <label for="exampleInputPassword1" class="form-label">Укажите Категорию</label>
                <div class="form-text">обязательно*</div>
                <button v-if="chooseCategory === null" type="button" class="form-control btn border" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Выбрать категорию</button>

                <div v-if="chooseCategory !== null" class="card" style="width: 24rem;">
                    <img src="..." class="card-img-top" alt="...">
                    <div class="card-body p-2">
                        <h5 class="card-title text-center">{{ chooseCategory.name }}</h5>
                        <button type="button" class="form-control btn border" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">Изменить</button>
                    </div>
                </div>
                <pre>{{ chooseCategory }}</pre>
            </div>
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

        <div v-if="chooseCategory !== null" class="container bg-body p-4 mb-2">
            <div class="form-text">Цена*</div>
            <div class="input-group mb-3">
                <span class="input-group-text">грн</span>
                <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
            </div>
        </div>

        <div v-if="chooseCategory !== null" class="container bg-body p-4 mb-2">
            <h5 for="exampleInputPassword1" class="form-label">Дополнительная информация</h5>
            <div v-for="parameter in chooseCategory.parameters" class="mb-3">
                <div class="form-text">{{ parameter.name }}</div>
                <select type="text" class="form-control">
                    <option v-for="option in parameter.options">{{ option.name }}</option>
                </select>
            </div>
            <div class="card flex justify-content-center">
                <MultiSelect v-model="selectedCities" :options="chooseCategory.parameters" optionLabel="name"
                    placeholder="Select Cities" :maxSelectedLabels="3" class="w-full md:w-20rem" />
            </div>
            {{ selectedCities }}
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
                        @click="getBack(parentId)">back</button>

                    <div class="row row-cols-3">
                        <div v-for="category in categories" class="col p-2 card">
                            <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                                alt="..." style="max-height: 20vh; object-fit: cover">
                            <div class="card-body p-1">
                                <h4 class="card-title text-center">{{ category.name }}</h4>
                            </div>
                            <div class="card-body d-flex justify-content-between p-1">
                                <button class="btn btn-outline-primary btn-sm" @click="receive(category.id)">Далее</button>
                                <button v-if="category.parent_category_id !== null" class="btn btn-outline-success btn-sm"
                                    @click="chooseCategoryFoo(category)" aria-label="Close"
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

import MultiSelect from 'primevue/multiselect';
const selectedCities = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
import InputMask from 'primevue/inputmask';
const phone = ref(null);

const { getUser } = storeToRefs(useAuthStore());
const { getCategories, getParentId } = storeToRefs(useForCategory());
const { getDataCategories, getDataCategory, backCategories } = useForCategory();
const route = useRoute();
const parentId = ref(null);
const categories = ref(getCategories);

const receive = (id) => {
    getDataCategories(parseInt(id));
    parentId.value = id;
};

const getBack = (id) => {
    console.log(id);
    backCategories(id.value ? id.value : id);
    parentId.value = getParentId.value ? getParentId.value : getParentId;
}

const chooseCategory = ref(null);

const chooseCategoryFoo = (category) => {
    chooseCategory.value = category;
    console.log(category);
}

onMounted(() => {
    getDataCategory();
});
</script>
<style></style>
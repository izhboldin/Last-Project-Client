<template>
    <div class="w-100 bg-body mt-4">
        <!-- <div class="container">
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
    <button  type="button" class="form-control btn border" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Выбрать категорию</button>

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
                                <button v-if="category.parent_category_id !== null && category.children.length === 0" class="btn btn-outline-success btn-sm"
                                    @click="getDataCategory(category.id)" aria-label="Close"
                                    data-bs-dismiss="modal">Выбрать</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div> -->
        <div class="card flex justify-content-center">
            <!-- <TreeSelect v-model="selectedNode" :options="treeData" :loading="loading" :filter="true"></TreeSelect> -->
            <!-- <TreeSelect v-model="selectedValue" :options="nodes" :loading="false" :filter="true" option-label="label" option-value="value"></TreeSelect> -->
            <!-- <TreeSelect v-model="selectedValue" :options="nodes" placeholder="Select Item" class="md:w-20rem w-full" /> -->
            <!-- <pre>{{ selectedValue }}</pre> -->
            <treeselect v-model="value" :multiple="false" :options="options" />
            <pre>{{ value }}</pre>
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

// import TreeSelect from 'primevue/treeselect';
// const nodes = ref([
//     { label: 'Node 1', value: 'node1', children: [{ label: 'Node 1.1', value: 'node1.1' }] },
//     { label: 'Node 2', value: 'node2', children: [{ label: 'Node 2.1', value: 'node2.1' }] },
// ]);
// const selectedValue = ref(null);
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const value = ref(null);
const options = ref([{
    id: 1,
    label: 'a',
    children: [{
        id: 'aa',
        label: 'aa',
    }, {
        id: 'ab',
        label: 'ab',
        children: [{
            id: 'aa1',
            label: 'aa1',
        }, {
            id: 'ab2',
            label: 'ab2',
        }],
    }],
}, {
    id: 'b',
    label: 'b',
}, {
    id: 'c',
    label: 'c',
}]);

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
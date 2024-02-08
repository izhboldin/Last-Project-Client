<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <!-- Сообщение собеседника -->
                <div class="media mb-3">
                    <img src="https://via.placeholder.com/40" class="mr-3 rounded-circle" alt="User Avatar">
                    <div class="media-body">
                        <p class="bg-light p-3 rounded">Сообщение собеседника здесь</p>
                    </div>
                </div>

                <!-- Ваше сообщение -->
                <div class="media mb-3 justify-content-end">
                    <div class="media-body">
                        <p class="bg-primary text-white p-3 rounded">Ваше сообщение здесь</p>
                    </div>
                    <img src="https://via.placeholder.com/40" class="ml-3 rounded-circle" alt="Your Avatar">
                </div>

                <!-- Добавьте новые сообщения, следуя тому же формату -->

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
import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import axiosInstance from '@/services/axios.js';
import Cookies from 'js-cookie';


export const useCreateCategory = defineStore('Category', () => {
    const categories = ref([]);

    const getCategories = computed(() => categories.value)

    const getDataCategory = async () => {
        try {
            let result = await axiosInstance.get('api/categories');
            categories.value = result.data[0];
            console.log(result.data);
            console.log(categories.value);
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }

    return {
        getCategories,
        getDataCategory,
    }
})
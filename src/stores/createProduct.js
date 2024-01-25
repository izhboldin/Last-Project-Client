import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import axiosInstance from '@/services/axios.js';
import Cookies from 'js-cookie';


export const useCreateCategory = defineStore('Category', () => {
    const product = ref(null)

    const getProduct = computed(() => product.value)

    const getDataCategory = async () => {
        try {
            let result = await axiosInstance.get('api/categories/get');
            categories.value = result.data;
            console.log(result.data);
            console.log(categories.value);
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }
    return {
    }
})
import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import axiosInstance from '@/services/axios.js';
import Cookies from 'js-cookie';


export const useForCategory = defineStore('forCategory', () => {
    const categories = ref([]);
    const parentId = ref(null)

    const getCategories = computed(() => categories.value)
    const getParentId = computed(() => parentId.value)

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

    const getDataCategories = async (data) => {
        try {
            let result = await axiosInstance.get(`api/categories/${data}`);
            if (result.data.length === 0) {
                return
            }
            categories.value = result.data;
            console.log(result.data);
            console.log(categories.value);
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }

    const backCategories = async (data) => {
        try {
            let result = await axiosInstance.get(`api/categories/back/${data}`)
            parentId.value = result.data.length == 0 ? null : result.data;
            result.data.length == 0 ? getDataCategory() : getDataCategories(result.data);
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }

    return {
        getCategories,
        getDataCategory,
        getDataCategories,
        backCategories,
        getParentId
    }
})
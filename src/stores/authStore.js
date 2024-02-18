import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import axiosInstance from '@/services/axios.js';
import Cookies from 'js-cookie';


export const useAuthStore = defineStore('alerts', () => {
    const user = ref(null);
    const token = ref(null);
    const isToken = ref(Cookies.get("token") != null);

    const getUser = computed(() => user.value)
    const getToken = computed(() => token.value)
    const getIsToken = computed(() => isToken.value)

    const register = async (date) => {
        try {
            let result = await axiosInstance.post('/api/register', date);

            console.log(result);
            if (result.data.user && result.data.token) {
                user.value = result.data.user;
                token.value = result.data.token;
                isToken.value = true;
                Cookies.set('token', token.value);
            }
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }

    const login = async (date) => {
        try {
            let result = await axiosInstance.post('/api/login', date);

            if (result.data.user && result.data.token) {
                user.value = result.data.user;
                token.value = result.data.token;
                isToken.value = true;
                Cookies.set('token', token.value);
            }
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }
    const getDataUser = async () => {
        try {
            if (!Cookies.get('token')) {
                return
            }
            if (user === null) {
                return
            }
            token.value = Cookies.get('token');
            let result = await axiosInstance.get('/api/user',
                {
                    headers: {
                        'Authorization': `Bearer ${token.value}`,
                    },
                });
            user.value = result.data.data;


        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    }

    const isBan = (data) => {
        let isBan = false;
        user.value.ban.forEach(ban => {
            if (ban.complaint_id.type == data && ban.is_permanent_ban == 1 || ban.complaint_id.type == data && ban.expiry_time > new Date().toISOString()) {
                isBan = true;
            }
        });
        return isBan
    }

    const logout = async () => {
        try {
            token.value = Cookies.get('token');
            if (!token.value) {
                return;
            }
            let result = await axiosInstance.post('/api/logout',
                {
                    headers: {
                        'Authorization': `Bearer ${token.value}`,
                    },
                });
            user.value = null;
            token.value = null;
            isToken.value = false;
            Cookies.remove('token');
        } catch (error) {
            console.error("Произошла ошибка при выходе из аккаунта:", error);
        }
    }

    return {
        register,
        login,
        getUser,
        getToken,
        getDataUser,
        isBan,
        logout,
        getIsToken
    }
})
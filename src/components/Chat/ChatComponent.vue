<template>
    <div class="py-4">
        <div class="container">
            <div class="row g-3">

                <div class="col-4">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <div class="mb-2">
                            <button v-bind:class="{ 'btn-info': route.query.status == 'buyer' }" class="btn  me-3"
                                type="button" @click="getBuyerStatus()">Покупаю</button>
                            <button v-bind:class="{ 'btn-info': route.query.status == 'seller' }" class="btn" type="button"
                                @click="getSellerStatus()">Продаю</button>
                        </div>
                        <div>

                            <!-- <div class="w-100 bg-light p-2 mb-2">
                                <div class="d-flex m-2">
                                    <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                        style="height: 42px; width: 42px;" alt=""
                                        class="img-fluid object-fit-cover rounded-circle me-3">
                                    <h6 class="my-1">саня</h6>
                                </div>
                            </div>

                            <div class="w-100 bg-info p-2 mb-2">
                                <div class="d-flex m-2">
                                    <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                        style="height: 42px; width: 42px;" alt=""
                                        class="img-fluid object-fit-cover rounded-circle me-3">
                                    <h6 class="my-1">саня</h6>
                                </div>
                            </div>
                            qwe -->
                            <template v-for="chat in chats">
                                <div @click="getMessages(chat.id)"
                                    v-bind:class="{ 'bg-info': route.query.chatId == chat.id, 'bg-light': route.query.chatId != chat.id }"
                                    class="cursor-pointer w-100 p-2 mb-2">
                                    <div class="d-flex m-2">
                                        <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                            style="height: 42px; width: 42px;" alt=""
                                            class="img-fluid object-fit-cover rounded-circle me-3">
                                        <h6 v-if="route.query.status == 'buyer'" class="my-1">{{ chat.seller.name }}</h6>
                                        <h6 v-if="route.query.status == 'seller'" class="my-1">{{ chat.buyer.name }}</h6>
                                    </div>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <!-- <div class="d-flex m-2 mb-3">
                            <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                style="height: 42px; width: 42px;" alt=""
                                class="img-fluid object-fit-cover rounded-circle me-3">
                            <div>
                                <h5 class="my-1">саня</h5>
                            </div>
                        </div> -->



                        <div class="w-100 bg-light p-3 flex-column-reverse mb-3 overflow-auto" style="min-height: calc(70vh - 56px); max-height: calc(70vh - 55px)">
                            <div v-for="message in messages" class="row h-100 justify-content-between">

                                <div v-if="message.user.id != getUser.id" class="row justify-content-start">

                                    <div class="d-flex mb-2">
                                        <div class="col-md-7 bg-secondary p-2 rounded">
                                            <h6 class="m-0">{{ message.message }}</h6>
                                            <p class="my-0 d-flex justify-content-end fw-light ">{{ format(new Date(message.created_at),"dd.MM HH:mm") }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="message.user.id == getUser.id" class="row justify-content-end">

                                    <div class="d-flex justify-content-end mb-2">
                                        <div class="col-md-7 bg-primary p-2 rounded">
                                            <h6 class="m-0">{{ message.message }}</h6>
                                            <p class="my-0 d-flex justify-content-end fw-light ">{{ format(new Date(message.created_at),"dd.MM HH:mm") }}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="w-100 ">
                            <div class="row">
                                <div class="col-8">
                                    <input type="text" class="w-100 form-control" v-model="messageValue">
                                </div>
                                <div class="col-4">
                                    <button class="w-100 btn btn-info" @click="sendMessage(messageValue)">отправить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

const { getToken, getUser } = storeToRefs(useAuthStore());

const route = useRoute()
const router = useRouter()

const chats = ref(null);
const messages = ref(null);
const messageValue = ref(null);

const checkStatus = () => {

    let queryData = { ...route.query };

    if (!queryData.status) {
        queryData.status = 'buyer';
        router.replace({ query: queryData });
        getChats('buyer')
        return
    }
    getChats(queryData.status)
}

const checkChatId = () => {

    let queryData = { ...route.query };

    if (!queryData.chatId) {
        console.log(123);
        return
    }
    getMessages(queryData.chatId)
}

const clearChatId = (status) => {
    let queryData = { ...route.query };
    if (queryData.status == status) {
        return
    }
    messages.value = null;
    chats.value = null;
    router.replace({ query: { 'status': status } });
}

const getBuyerStatus = () => {
    clearChatId('buyer')
    getChats('buyer')
}

const getSellerStatus = () => {
    clearChatId('seller')
    getChats('seller')
}

const getChats = async (status) => {
    try {
        let result = await axiosInstance.get(`api/chats?status=${status}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        chats.value = result.data.data;
        console.log(result.data.data);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

    let queryData = { ...route.query };
    queryData.status = status === 'buyer' ? 'buyer' : 'seller';
    router.replace({ query: queryData });
}

const getMessages = async (chatId) => {
    let queryData = { ...route.query };

    if(!chatId){
        return
    }

    if (queryData.chatId) {
        if (queryData.chatId != chatId) {
            queryData.chatId = chatId;
        }
    } else {
        queryData.chatId = chatId;
    }
    router.replace({ query: queryData });

    try {
        let result = await axiosInstance.get(`api/chats/${chatId}/message`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        messages.value = result.data.data;
        messages.value.reverse();;
        console.log(result.data.data);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

}

const sendMessage = async (message) => {
    let queryData = { ...route.query };

    if(!message || message == '' || !queryData.chatId){
        return
    }
    const data = {
        'message': message,
    }

    try {
        let result = await axiosInstance.post(`api/chats/${queryData.chatId}/message`, data, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        console.log(result.data);
        messageValue.value = null;
        getMessages(queryData.chatId)
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

}

onMounted(() => {
    checkStatus()
    checkChatId()
})

</script>
<style>
.flex-column-reverse {
    display: flex;
    flex-direction: column-reverse;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
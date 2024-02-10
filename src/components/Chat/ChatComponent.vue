<template>
    <div class="py-4">
        <div class="container">
            <div class="row g-3">

                <div class="col-3">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <div class="mb-2">
                            <button v-bind:class="{ 'btn-info': route.query.status == 'buyer' }" class="btn  me-3"
                                type="button" @click="getBuyerStatus()">Покупаю</button>
                            <button v-bind:class="{ 'btn-info': route.query.status == 'seller' }" class="btn" type="button"
                                @click="getSellerStatus()">Продаю</button>
                        </div>
                        <div>

                            <div v-if="!chats" class="text-center mt-5">Загрузка</div>
                            <div v-if="chats && chats.length == 0" class="text-center mt-5">У вас нет чатов</div>

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
                                        <div class="w-100 d-flex justify-content-end align-items-start">
                                            <IconEnvelope @click="SendСomplaintChatId(chat.id)" data-bs-toggle="modal"
                                                data-bs-target="#exampleModal" class="cursor-pointer"
                                                style="width: 20px; height: 20px;"></IconEnvelope>
                                        </div>
                                    </div>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <!-- <div class="d-flex m-2 mb-3">
                            <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                style="height: 42px; width: 42px;" alt=""
                                class="img-fluid object-fit-cover rounded-circle me-3">
                            <div>
                                <h5 class="my-1">саня</h5>
                            </div>
                        </div> -->



                        <div class="w-100 bg-light p-3 flex-column-reverse mb-3 overflow-auto"
                            style="min-height: calc(70vh - 56px); max-height: calc(70vh - 55px)">
                            <div v-if="!messages && !route.query.chatId" class="m-auto">Виберите чат</div>
                            <div v-if="!messages && route.query.chatId && !WindowMessageValue" class="m-auto">Загрузка</div>
                            <div v-if="!messages && route.query.chatId && WindowMessageValue" class="m-auto">Чата не существует</div>

                            <template v-if="messages">
                                <div v-if="messages.length == 0 && route.query.chatId" class="m-auto">Этот чат пуст</div>
                                <div v-for="message in messages" class="row h-100 justify-content-between">

                                    <div v-if="message.user.id != getUser.id" class="row justify-content-start">

                                        <div class="d-flex mb-2">
                                            <div class="col-md-7 bg-secondary p-2 rounded">
                                                <h6 class="m-0">{{ message.message }}</h6>
                                                <p class="my-0 d-flex justify-content-end fw-light ">{{ format(new
                                                    Date(message.created_at), "dd.MM HH:mm") }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="message.user.id == getUser.id" class="row justify-content-end">

                                        <div class="d-flex justify-content-end mb-2">
                                            <div class="col-md-7 bg-primary p-2 rounded">
                                                <h6 class="m-0">{{ message.message }}</h6>
                                                <p class="my-0 d-flex justify-content-end fw-light ">{{ format(new
                                                    Date(message.created_at), "dd.MM HH:mm") }}</p>
                                                <!-- <p class="my-0 d-flex justify-content-end fw-light ">
                                                    <IconTrash @click="" class="cursor-pointer" style="width: 20px; height: 20px;"></IconTrash>
                                                    {{ format(new Date(message.created_at), "dd.MM HH:mm") }}</p> -->
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </template>
                        </div>

                        <div class="w-100 ">
                            <div class="row">
                                <div class="col-8">
                                    <input type="text" class="w-100 form-control" v-model="messageValue"
                                        @keyup.enter="sendMessage(messageValue)">
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


    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Жалоба на пользователя</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label class="mb-1">Виберите причину жалобы:</label>
                    <select v-model="reasonСomplaint" class="form-control mb-2">
                        <option value="">-</option>
                        <option value="w">Нецензурное поведение</option>
                        <option value="w">Спам и нежелательные сообщения</option>
                        <option value="w">Оскорбительное поведение</option>
                        <option value="w">Попытки обмана</option>
                        <option value="w">Другое нарушение</option>
                    </select>
                    <label class="mb-1">Подробно опишите причину жалобы:</label>
                    <textarea v-model="descriptionСomplaint" type="text" class="form-control"></textarea>
                    {{СomplaintChatId}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-primary">Отправить жалобу</button>
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
import IconTrash from '@/components/icons/IconTrash.vue';
import IconEnvelope from '@/components/icons/IconEnvelope.vue';


const { getToken, getUser } = storeToRefs(useAuthStore());

const route = useRoute()
const router = useRouter()

const chats = ref(null);
const messages = ref(null);
const messageValue = ref(null);
const WindowMessageValue = ref(null);
const messageValueBroadcast = ref(null);

const СomplaintChatId = ref(null);
const reasonСomplaint = ref("");
const descriptionСomplaint = ref(null);

const SendСomplaintChatId = (id) => {
    СomplaintChatId.value = id;
}

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
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

    let queryData = { ...route.query };
    queryData.status = status === 'buyer' ? 'buyer' : 'seller';
    router.replace({ query: queryData });
}

const getMessages = async (chatId) => {
    let queryData = { ...route.query };

    if (!chatId) {
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
        WindowMessageValue.value = null;
    } catch (error) {
        WindowMessageValue.value = [];
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

}

const sendMessage = async (message) => {
    let queryData = { ...route.query };

    if (!message || message == '' || !queryData.chatId) {
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
        // messages.value.unshift(result.data.data)
        messageValue.value = null;
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }

}

onMounted(() => {
    checkStatus();
    checkChatId();
    // Echo.channel(`messages.${1}`)
    // .listen('MessageWasCreated', (e) => {
    //     messageValueBroadcast.value = e;
    //     messages.value.unshift( e.message)
    // });
    Echo.channel(`chat`)
        .listen('MessageSent', (e) => {
            messageValueBroadcast.value = e;
            if (e.message.chat == route.query.chatId) {
                messages.value.unshift(e.message)
            }
        });
});

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
<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div v-if="previewImage" class="mb-3">
                        <p>Так будет выглядеть ваша аватарка</p>
                        <img :src="previewImage" style="height: 240px; width: 240px;" alt="Превью"
                            class="img-fluid object-fit-cover rounded-circle ">
                    </div>
                    <form>
                        <div class="mb-3">
                            <label for="photoInput" class="form-label">Выберите фотографию</label>
                            <input type="file" class="form-control" id="photoInput" accept="image/*"
                                @change="handleFileChange">
                        </div>
                        <button type="button" class="btn btn-primary me-3" @click="getImgForUser()">Отправить</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Назад</button>
                    </form>

                </div>
            </div>
        </div>
    </div>


    <div class="py-4">
        <div class="container">
            <div class="row g-3">

                <div class="col-9">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <template v-if="getUser">
                            <div class="d-flex justify-content-center">

                                <img v-if="getUser.image" v-bind:src="getUser.image.full_url"
                                    style="height: 240px; width: 240px;" alt=""
                                    class="img-fluid object-fit-cover rounded-circle me-2 ">
                                <img v-if="!getUser.image" src="http://localhost:8080/storage/images/no-user-image.webp"
                                    style="height: 240px; width: 240px;" alt=""
                                    class="img-fluid object-fit-cover rounded-circle me-2">
                            </div>
                            <h3>{{ getUser.name }}</h3>
                            <p>почта: {{ getUser.email }}</p>
                        </template>
                    </div>
                </div>
                <div class="col-3">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Изменить
                            картинку</button>
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
import axiosInstanceForImg from '@/services/axiosForImg.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { format } from 'date-fns';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconEnvelope from '@/components/icons/IconEnvelope.vue';

import { validationMixin } from '@/services/mixins/validationMixin.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const { getToken, getUser } = storeToRefs(useAuthStore());

const route = useRoute()
const router = useRouter()

const previewImage = ref(null);
const selectedFile = ref(null);

const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        selectedFile.value = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        previewImage.value = null;
        selectedFile.value = null;
    }
}

const getImgForUser = async () => {
    try {
        if (!selectedFile.value) {
            toast.error("Файл не выбран.", { autoClose: 2000 });
            return;
        }

        

        const formData = new FormData()
        formData.append('images[0][file]', selectedFile.value);
    

        let result = await axiosInstanceForImg.post('/api/user/images', formData, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log(result.data);
        toast.success("Картинка успешно изменена!", { autoClose: 2000 });
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {

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
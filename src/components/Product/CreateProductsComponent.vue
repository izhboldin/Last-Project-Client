<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center pb-2">Cоздание Объявления</h2>
        <template v-if="getUser">
            <template v-if="!isBan('product')">
                <div class="container bg-body p-4 mb-2">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Укажите название</label>
                        <div class="form-text">обязательно*</div>
                        <input v-model="name" type="text" class="form-control">
                        <span class="text-danger">{{ messageName }}</span>
                    </div>
                    <div class="mb-1">
                        <label for="exampleInputPassword1" class="form-label">Укажите Категорию</label>
                        <div class="form-text">обязательно*</div>
                        <button v-if="category === null" type="button" class="form-control btn border"
                            data-bs-toggle="modal" data-bs-target="#exampleModal">Выбрать категорию</button>

                        <div v-if="category !== null" class="card" style="width: 24rem;">

                            <img v-if="category.image" v-bind:src="category.image.full_url"
                                class="img-fluid object-fit-cover p-2 " alt="...">

                            <img v-if="!category.image" src="http://localhost:8080/storage/images/no_image_available.png"
                                class="img-fluid object-fit-cover p-2 " alt="...">

                            <div class="card-body p-2">
                                <h5 class="card-title text-center">{{ category.name }}</h5>
                                <button type="button" class="form-control btn border" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">Изменить</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container bg-body p-4 mb-2">
                    <h5 class="pb-2">Фото</h5>
                    <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                        <div class="col">
                            <div class="p-1 border bg-light" style="height: 260px;">
                                <div v-if="previewImage[0]" class="w-100 h-100">
                                    <img :src="previewImage[0]" alt="Превью" class="img-fluid object-fit-cover w-100 h-100">
                                </div>
                                <div v-if="!previewImage[0]"
                                    class="d-flex align-items-center justify-content-center w-100 h-100 ">
                                    <span class="material-symbols-outlined">image</span>
                                </div>
                            </div>
                            <input type="file" class="form-control" id="photoInput-0" accept="image/*"
                                @change="handleFileChange">
                        </div>

                        <div class="col">
                            <div class="p-1 border bg-light" style="height: 260px;">
                                <div v-if="previewImage[1]" class="w-100 h-100">
                                    <img :src="previewImage[1]" alt="Превью" class="img-fluid object-fit-cover w-100 h-100">
                                </div>
                                <div v-if="!previewImage[1]"
                                    class="d-flex align-items-center justify-content-center w-100 h-100 ">
                                    <span class="material-symbols-outlined">image</span>
                                </div>
                            </div>
                            <input type="file" class="form-control" id="photoInput-1" accept="image/*"
                                @change="handleFileChange">
                        </div>

                        <div class="col">
                            <div class="p-1 border bg-light" style="height: 260px;">
                                <div v-if="previewImage[2]" class="w-100 h-100">
                                    <img :src="previewImage[2]" alt="Превью" class="img-fluid object-fit-cover w-100 h-100">
                                </div>
                                <div v-if="!previewImage[2]"
                                    class="d-flex align-items-center justify-content-center w-100 h-100 ">
                                    <span class="material-symbols-outlined">image</span>
                                </div>
                            </div>
                            <input type="file" class="form-control" id="photoInput-2" accept="image/*"
                                @change="handleFileChange">
                        </div>

                        <div class="col">
                            <div class="p-1 border bg-light" style="height: 260px;">
                                <div v-if="previewImage[3]" class="w-100 h-100">
                                    <img :src="previewImage[3]" alt="Превью" class="img-fluid object-fit-cover w-100 h-100">
                                </div>
                                <div v-if="!previewImage[3]"
                                    class="d-flex align-items-center justify-content-center w-100 h-100 ">
                                    <span class="material-symbols-outlined">image</span>
                                </div>
                            </div>
                            <input type="file" class="form-control" id="photoInput-3" accept="image/*"
                                @change="handleFileChange">
                        </div>

                    </div>
                </div>

                <div class="container bg-body p-4 mb-2">
                    <div class="mb-3">
                        <div class="form-text">Описание*</div>
                        <textarea v-model="description" type="text" class="form-control"></textarea>
                        <span class="text-danger">{{ messageDescription }}</span>
                    </div>
                </div>

                <div v-if="category !== null" class="container bg-body p-4 mb-2">
                    <div class="form-text ">Цена*</div>
                    <div class="input-group">
                        <span class="input-group-text">грн</span>
                        <input v-model="price" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                    <span class="text-danger">{{ messagePrice }}</span>

                    <div class="form-text mt-3">Состояние*</div>
                    <div class="input-group">
                        <select v-model="state" class="form-control">
                            <option value="">-</option>
                            <option value="second-hand">Б/у</option>
                            <option value="new">Новый</option>
                        </select>
                    </div>
                </div>

                <div v-if="category !== null && category.parameters.length" class="container bg-body p-4 mb-2">
                    <h5 for="exampleInputPassword1" class="form-label">Дополнительная информация</h5>
                    <div v-for="parameter in category.parameters" class="mb-3">
                        <div class="form-text">{{ parameter.name }}</div>
                        <select v-if="parameter.type == 'select'" v-model="selectValue[parameter.id]" class="form-control">
                            <option v-for="option in parameter.options" :value="option.id">{{ option.name }}</option>
                        </select>
                        <div v-if="parameter.type == 'multiselect'" class="card flex justify-content-center">
                            <MultiSelect v-model="multiselectValue[parameter.id]" :options="parameter.options"
                                optionLabel="name" placeholder="" :maxSelectedLabels="30" class="w-full md:w-20rem" />
                        </div>
                    </div>
                    <!-- <pre>multiselectValue: {{ multiselectValue }}</pre>
            <pre>selectValue: {{ selectValue }}</pre> -->
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
                        <input v-if="getUser" v-bind:value="getUser.email" type="text" class="form-control" disabled>
                        <input v-if="!getUser" type="text" class="form-control">
                    </div>
                    <div v-if="getUser" class="mb-1">
                        <div class="form-text">Номер телефона</div>
                        <InputMask id="phone" class="form-control" v-model="getUser.phone" mask="(999) 999-9999"
                            placeholder="(999) 999-9999" disabled />
                    </div>

                </div>

                <div class="container bg-body pt-4 pb-2">
                    <!-- <button type="submit" class="btn btn-primary me-2"
                        @click="setImgForProduct()">отправить</button> -->
                    <button type="submit" class="btn btn-primary me-2"
                        @click="checkBeforeCreation(name, category, description, price, state, multiselectValue, selectValue)">отправить</button>
                    <button type="button" class="btn btn-secondary" @click="router.go(-1)">назад</button>
                    <p class="text-danger">{{ messageCheck }}</p>
                </div>
            </template>
            <template v-if="isBan('product')">
                <div class="container">
                    <template v-for="ban in getUser.ban">
                        <!-- <pre>
                            {{ ban }}
                        </pre> -->
                        <template v-if="ban.complaint_id.type == 'product'">
                            <h4 v-if="ban.is_permanent_ban == 1">У вас заблокирован доступ к созданию объявлений навсегда
                            </h4>
                            <h4 v-if="ban.expiry_time">У вас заблокирован доступ к созданию объявлений до {{
                                ban.expiry_time }}</h4>
                        </template>
                    </template>
                </div>
            </template>
        </template>

    </div>



    <!-- Modal -->
    <div class="modal fade modal-lg" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <button class="btn btn-outline-primary btn-sm mb-2 w-100" v-if="parentId !== null"
                        @click="getBack()">back</button>

                    <div v-if="currentCategory !== null" class="row g-2">

                        <div v-for="category in currentCategory" class="col-4">
                            <div class="p-2 card">

                                <img v-if="category.image" v-bind:src="category.image.full_url" class="card-img"
                                    style="max-height: 20vh; object-fit: cover" alt="...">

                                <img v-if="!category.image"
                                    src="http://localhost:8080/storage/images/no_image_available.png" class="card-img"
                                    style="max-height: 20vh; object-fit: cover" alt="...">

                                <!-- <img src="https://i.ucrazy.ru/files/pics/2023.10/2023-10-17-21-53-072.webp" class="card-img"
                                    alt="..." style="max-height: 20vh; object-fit: cover"> -->
                                <div class="card-body p-1">
                                    <h4 class="card-title text-center">{{ category.name }}</h4>
                                </div>
                                <div class="card-body d-flex justify-content-between p-1">
                                    <button :disabled="category.children.length === 0"
                                        class="btn btn-outline-primary btn-sm"
                                        @click="receive(category.children, category.parent_category_id)">Далее</button>

                                    <button v-if="category.parent_category_id !== null && category.children.length === 0"
                                        class="btn btn-outline-success btn-sm" @click="getDataCategory(category.id)"
                                        aria-label="Close" data-bs-dismiss="modal">Выбрать</button>
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
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import axiosInstance from '@/services/axios.js';
import axiosInstanceForImg from '@/services/axiosForImg.js';
import { productValidMixin } from '@/services/mixins/productValidMixin.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import MultiSelect from 'primevue/multiselect';
import InputMask from 'primevue/inputmask';
const multiselectValue = ref({});
const selectValue = ref({});

const { getUser, getToken } = storeToRefs(useAuthStore());
const { isBan } = useAuthStore();

const route = useRoute();
const router = useRouter()

const parentId = ref(null);
const currentParentId = ref(null);
const categories = ref(null);
const currentCategory = ref(null);
const category = ref(null);

const name = ref('');
const description = ref('');
const price = ref('');
const state = ref('');
const phone = ref('');

const messageName = ref(null);
const messageDescription = ref(null);
const messagePrice = ref(null);
const messagePhone = ref(null);
const messageCheck = ref(null);

const selectedFile = ref([]);
const previewImage = ref([]);


const handleFileChange = (event) => {
    console.log(event.target.id);
    const fileId = event.target.id;
    const fileIndex = fileId.split('-');
    const file = event.target.files[0];

    if (file) {
        if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5242880) {

            const existingFileIndex = selectedFile.value.findIndex(item => item.name === fileIndex[1]);

            if (existingFileIndex === -1) {
                selectedFile.value.push({
                    index: fileIndex[1],
                    file: file
                });
            }
            else {
                selectedFile.value[existingFileIndex].file = file;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.value[fileIndex[1]] = e.target.result;
            };

            reader.readAsDataURL(file);
        } else {
            toast.error("Формат изображения должен быть JPEG или PNG, размер не должен превышать 5 МБ!", { autoClose: 2000 });
            event.target.value = '';
        }
    } else {
        previewImage.value[fileIndex[1]] = null;
        selectedFile.value = null;
    }
}

watch(category, newValue => {
    multiselectValue.value = {};
    selectValue.value = {};
    newValue.parameters.forEach(element => {
        if (element.type === 'multiselect') {
            // console.log(123);
            multiselectValue.value[`${element.id}`] = [];
        }
        if (element.type === 'select') {
            selectValue.value[`${element.id}`] = '';
        }
        console.log(element.id, element.type);
    });
})

watch(name, newValue => {
    return messageName.value = productValidMixin.validName(newValue);
})
watch(description, newValue => {
    return messageDescription.value = productValidMixin.validDescription(newValue);
})
watch(price, newValue => {
    return messagePrice.value = productValidMixin.validPrice(newValue);
})
watch(phone, newValue => {
    return messagePhone.value = productValidMixin.validPhone(newValue);
})


const getAllCategories = async () => {
    try {
        let result = await axiosInstance.get(`api/categories`);
        if (result.data.length === 0) {
            return
        }
        categories.value = result.data;
        currentCategory.value = result.data;
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getDataCategory = async (data) => {
    try {
        let result = await axiosInstance.get(`api/categories/${data}`);
        if (result.data.length === 0) {
            return
        }
        category.value = result.data.data;
        console.log(result.data);
        console.log(category.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const receive = (category, parId) => {
    currentCategory.value = category;
    parId == null ? parentId.value = 0 : parentId.value = parId;
};


const getBack = () => {
    if (parentId.value == 0) {
        parentId.value = null;
        return currentCategory.value = categories.value;
    }
    categories.value.forEach(category => {
        if (category.children) {
            currentParentId.value = category.parent_category_id
            searchCategories(category.children);
        }
    });
}

const searchCategories = (categories) => {
    categories.forEach(category => {
        if (category.parent_category_id == parentId.value) {
            currentCategory.value = categories;
            currentParentId.value === null ? parentId.value = 0 : parentId.value = currentParentId.value;
            return 0;
        }
        if (category.children) {
            currentParentId.value = category.parent_category_id
            searchCategories(category.children);
        }
    });
}

const checkBeforeCreation = (name, category, description, price, state, multiselect, select) => {
    if (messageName.value != null || messageDescription.value != null || messagePrice.value != null || messagePhone.value != null) {
        return messageCheck.value = 'Проверьте все поля на правильность введения';
    }
    if (name == '' || description == '' || category == null || state == '') {
        return messageCheck.value = 'Заполние важные поля';
    }
    if (price == '') {
        return messageCheck.value = 'Введите стоимость объявления';
    }

    let options = [];
    console.log(multiselect);
    for (const key in multiselect) {
        if (multiselect[key].length === 0) {
            return messageCheck.value = 'Заполните всю дополнительну информацию';
        } else {
            multiselect[key].forEach(el => {
                options.push(el.id);
            })
        }
    }
    for (const key in select) {
        if (select[key].length === 0) {
            return messageCheck.value = 'Заполните всю дополнительну информацию';
        } else {
            options.push(select[key]);
        }
    }
    messageCheck.value = ''

    console.log('класс');

    const data = {
        'title': name,
        'user_id': getUser.id,
        'description': description,
        'price': price,
        'state': state,
        'status': 'wait',
        'category_id': category.id,
        'options': options,
    }
    createProduct(data);

}



const createProduct = async (data) => {
    try {
        let result = await axiosInstance.post('api/products', data, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        console.log(result.data);
        toast.success("Объявление успешно создано!", {
            autoClose: 2000,
        });
        setImgForProduct(result.data.id)
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const setImgForProduct = async (id) => {
    try {
        if (!selectedFile.value || selectedFile.value.length == 0) {
            router.push({ name: 'yourWaitProducts' })
            return;
        }

        const formData = new FormData()
        selectedFile.value.forEach(el => {
            if (selectedFile.value[el.index]) {
                formData.append(`images[${el.index}][file]`, el.file);
            }
        })


        let result = await axiosInstanceForImg.post(`/api/product/${id}/images`, formData, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(result.data);

        router.push({ name: 'yourWaitProducts' })
        // toast.success("Картинка успешно изменена!", { autoClose: 2000 });
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getAllCategories();
});
</script>
<style></style>
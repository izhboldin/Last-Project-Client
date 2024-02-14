<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center pb-2">Редактирование Объявления</h2>

        <div class="container bg-body p-4 mb-2">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Укажите название</label>
                <div class="form-text">обязательно*</div>
                <input v-model="name" type="text" class="form-control">
                <span class="text-danger">{{ messageName }}</span>
            </div>
        </div>

        <div class="container bg-body p-4 mb-2">
            <h5 class="pb-2">Фото</h5>
            <template v-if="getUser && product">

                <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                    <div v-for="index in 4" :key="index" class="col">
                        <!-- Use conditional logic to display images or placeholder -->
                        <div class="p-1 border bg-light" style="height: 260px;">
                            <div v-if="previewImage[index-1]" class="w-100 h-100">
                                <img :src="previewImage[index-1]" alt="Превью" class="img-fluid object-fit-cover w-100 h-100">
                            </div>
                            <div v-else-if="product.images[index-1]" class="w-100 h-100">
                                <img :src="product.images[index-1].full_url" alt="Превью"
                                    class="img-fluid object-fit-cover w-100 h-100">
                            </div>
                            <div v-else class="d-flex align-items-center justify-content-center w-100 h-100">
                                <span class="material-symbols-outlined">image</span>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <!-- Use conditional logic to display file input or update input based on image existence -->
                            <input v-if="!product.images[index-1]" type="file" class="form-control"
                                :id="'photoInput-' + index-1" accept="image/*" @change="handleFileChange">
                            <input v-else type="file" class="form-control" :id="product.images[index-1].id + '-' + index-1"
                                accept="image/*" @change="handleFileUpdate">
                            <!-- Use conditional logic to display delete button based on image existence -->
                            <button v-if="product.images[index-1]" @click="deleteImage(product.images[index-1].id, index-1)"
                                type="button" class="btn btn-danger input-group-text">del</button>
                        </div>
                    </div>
                </div>

            </template>

            {{ selectedFile }}
            <!-- {{ previewImage }} -->
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
                    <MultiSelect v-model="multiselectValue[parameter.id]" :options="parameter.options" optionLabel="name"
                        placeholder="" :maxSelectedLabels="30" class="w-full md:w-20rem" />
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

        <div class="container bg-body pt-4 pb-2">
            <button type="submit" class="btn btn-primary me-2"
                @click="checkBeforeCreation(name, category, description, price, state, multiselectValue, selectValue)">Изменить</button>
            <button type="button" class="btn btn-secondary" @click="router.go(-1)">назад</button>
            <p class="text-danger">{{ messageCheck }}</p>
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
import MultiSelect from 'primevue/multiselect';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const product = ref(null);
const optionsArr = ref(null);

const multiselectValue = ref({});
const selectValue = ref({});

const { getUser, getToken } = storeToRefs(useAuthStore());
const route = useRoute();
const router = useRouter()

const parentId = ref(null);
const currentParentId = ref(null);
const currentCategory = ref(null);
const category = ref(null);
const phone = ref(null);

const name = ref('');
const description = ref('');
const price = ref('');
const state = ref('');

const messageName = ref(null);
const messageDescription = ref(null);
const messagePrice = ref(null);
const messagePhone = ref(null);
const messageCheck = ref(null);

const selectedFile = ref(null);
const previewImage = ref([]);

const handleFileUpdate = (event) => {
    handleFile(event)
}

const handleFileChange = (event) => {
    handleFile(event)
}

const handleFile = (event) => {
    console.log(event.target.id);
    const fileId = event.target.id;
    const fileIndex = fileId.split('-');
    const file = event.target.files[0];

    if (file) {
        if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5242880) {

            selectedFile.value = file;
            const reader = new FileReader();

            reader.onload = (e) => {
                previewImage.value = e.target.result;
            };
            createImage(fileIndex[1], fileIndex[0])
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
            multiselectValue.value[`${element.id}`] = [];
        }
        if (element.type === 'select') {
            selectValue.value[`${element.id}`] = '';
        }
    });
    setOptionsFromQuery(optionsArr.value);
})

watch(product, newValue => {
    getOptionsArr(newValue.options)
    getCategory(newValue.category.id)

    name.value = newValue.title
    description.value = newValue.description
    price.value = newValue.price
    state.value = newValue.state
})

const setOptionsFromQuery = (queryOption) => {
    if (category.value == null) {
        return;
    }
    if (queryOption && category.value.parameters) {
        let optionsArr = queryOption;
        if (!(Array.isArray(optionsArr))) {
            optionsArr = [parseInt(queryOption)]
        }
        optionsArr = optionsArr.map(str => parseInt(str));

        category.value.parameters.forEach(parameter => {
            parameter.options.forEach(option => {
                if (optionsArr.includes(option.id)) {
                    if (parameter.type == 'select') {
                        selectValue.value[`${parameter.id}`] = option.id;
                    }
                    if (parameter.type == 'multiselect') {
                        multiselectValue.value[`${parameter.id}`].push({
                            "id": option.id,
                            "name": option.name
                        });
                    }
                }
            })

        })
    }
}

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

const getCategory = async (data) => {
    try {
        let result = await axiosInstance.get(`api/categories/${data}`);
        if (result.data.length === 0) {
            return
        }
        category.value = result.data.data;
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const deleteImage = async (id, index) => {
    try {
        let result = await axiosInstance.get(`api/product/${id}/images/delete`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            },
        });
        product.value.images.splice(index, 1);
        toast.success("Изображение успешно удалено!", { autoClose: 2000 });

    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const createImage = async (index, imageId) => {
    try {
        if (!selectedFile.value) {
            return;
        }

        const formData = new FormData()

        formData.append(`images[0][file]`, selectedFile.value);
        let result
        if (product.value.images[index]) {
            result = await axiosInstanceForImg.post(`/api/product/${route.params.id}/${imageId}/update`, formData, {
                headers: {
                    'Authorization': `Bearer ${getToken.value}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        else {
            result = await axiosInstanceForImg.post(`/api/product/${route.params.id}/images`, formData, {
                headers: {
                    'Authorization': `Bearer ${getToken.value}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        console.log(result.data);
        product.value.images[index] = result.data.data[0];

        toast.success("Картинка успешно создана!", { autoClose: 2000 });
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
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

const getOptionsArr = (options) => {
    optionsArr.value = options.map(obj => obj.id);
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


    const data = {
        'title': name,
        'description': description,
        'price': price,
        'state': state,
        'status': 'wait',
        'options': options,
    }
    updateProduct(data);

}

const updateProduct = async (data) => {
    try {
        let result = await axiosInstance.put(`api/products/${route.params.id}`, data, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        router.push({ name: 'yourWaitProducts' })
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getProduct = async (data) => {
    try {
        let result = await axiosInstance.get(`api/products/${data}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        product.value = result.data.data;
        console.log(product.value);

    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getProduct(route.params.id);
});
</script>
<style></style>
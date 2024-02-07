<template>
    <div class="bg-light w100 p-3">
        <h2 class="text-center pb-2">Cоздание Объявления</h2>

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
            <button type="submit" class="btn btn-primary"
                @click="checkBeforeCreation(name, category, description, price, state, multiselectValue, selectValue)">отправить</button>
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
import { productValidMixin } from '@/services/mixins/productValidMixin.js';


const product = ref(null);
const optionsArr = ref(null);

import MultiSelect from 'primevue/multiselect';
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
    });
})

watch(product, newValue => {
    // console.log(newValue.category.id);
    getDataCategory(newValue.category.id)
    getOptionsArr(newValue.options)
    setOptionsFromQuery(route.query.options);
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

const getDataCategory = async (data) => {
    try {
        let result = await axiosInstance.get(`api/categories/${data}`);
        if (result.data.length === 0) {
            return
        }
        category.value = result.data.data;
        console.log(category.value);
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
    console.log(data);
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
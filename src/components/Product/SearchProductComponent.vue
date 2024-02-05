<template>
    <div class="py-4">
        <div class="container pb-4">
            <div class="input-group">
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" v-model="searchValue">
                <button class="btn btn-info" type="button" id="button-addon2 " @click="search()">Поиск</button>
            </div>
        </div>
        <div v-if="categories" class="w-100">
            <div class="container">
                <h4><strong>Фильтры</strong></h4>
                <div class="row row-cols-2 row-cols-lg-5 g-3 g-lg-3">

                    <div class="col">
                        <div class="p-2 ">
                            <label for="exampleInputEmail1" class="form-label mb-0">Категория</label>
                            <button v-if="!(route.query.categoryId)" class="form-control">Все категории</button>
                            <button v-if="(route.query.categoryId)" class="form-control">{{ categories.name }}</button>
                        </div>
                    </div>
                    <div class="col">
                        <label for="exampleInputEmail1" class="form-label mb-0">Цена</label>
                        <div class="p-2  input-group">
                            <input type="number" class="form-control" placeholder="От:" v-model="priceMin">
                            <input type="number" class="form-control" placeholder="До:" v-model="priceMax">
                        </div>
                    </div>
                    <div v-for="parameter in categories.parameters" class="col">
                        <label for="exampleInputEmail1" class="form-label mb-0">{{ parameter.name }}</label>
                        <div class="p-2  input-group">
                            <select v-if="parameter.type == 'select'" class="form-control"
                                v-model="selectValue[parameter.id]">
                                <option value="">-</option>
                                <option v-for="option in parameter.options" :value="option.id">{{ option.name }}</option>
                            </select>
                            <div v-if="parameter.type == 'multiselect'" class="w-100">
                                <MultiSelect v-model="multiselectValue[parameter.id]" :options="parameter.options"
                                    optionLabel="name" placeholder="" :maxSelectedLabels="30" class="w-full w-100" />
                            </div>
                        </div>
                    </div>
                    <!-- <pre>multiselectValue: {{ multiselectValue }}</pre>
                    <pre>selectValue: {{ selectValue }}</pre> -->
                </div>
            </div>
            <div class="border-bottom mb-3"></div>
            <div class="container">
                <div class="col-3">
                    <div class="p-2  input-group">
                        <span class="input-group-text bg-info">Сортировка</span>
                        <select class="form-control" v-model="sort">
                            <option value="">-</option>
                            <option value="price=asc">Цена по возрастанию</option>
                            <option value="price=desc">Цена по убыванию</option>
                            <option value="date=desc">Самые новые</option>
                            <option value="date=asc">Самые старые</option>
                        </select>
                    </div>
                </div>
                <div class="row g-2">

                    <div v-for="product in products" class="col-3 ">
                        <div @click="router.push({ name: 'product', params: { id: product.id } })"
                            class="cursor-pointer p-3 bg-body">
                            <img src="https://i.redd.it/ux74bsifrpda1.jpg" class="card-img" alt="..."
                                style="max-height: 30vh; object-fit: cover">
                            <h5 class="py-2">{{ product.title }}</h5>
                            <h6>{{ product.price }} грн.</h6>

                        </div>
                    </div>
                    <h4 class="text-center p-5" v-if="!products || !products.length">Объявления не найдены</h4>

                </div>
            </div>
        </div>
        <h3 class="text-center p-5" v-if="!categories">404</h3>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';
import { format } from 'date-fns';
import MultiSelect from 'primevue/multiselect';


const { getToken } = storeToRefs(useAuthStore());

const route = useRoute();
const router = useRouter();

const categories = ref(null);
const products = ref(null);
const searchInput = ref(null);
const priceMin = ref(null);
const priceMax = ref(null);
const searchValue = ref(null);

const multiselectValue = ref({});
const selectValue = ref({});
const sort = ref('');

watch(categories, newValue => {
    multiselectValue.value = {};
    selectValue.value = {};
    if (Array.isArray(newValue)) {
        return
    }
    newValue.parameters.forEach(element => {
        if (element.type === 'multiselect') {
            multiselectValue.value[`${element.id}`] = [];
        }
        if (element.type === 'select') {
            selectValue.value[`${element.id}`] = '';
        }
    });

    if (route.query.options && categories.value.parameters) {
        let optionsArr = route.query.options;
        if (!(Array.isArray(optionsArr))) {
            optionsArr = [parseInt(route.query.options)]
        }
        optionsArr = optionsArr.map(str => parseInt(str));

        categories.value.parameters.forEach(parameter => {
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


})

const search = () => {
    let query = {};
    if (categories.value) {
        query.categoryId = categories.value.id;
    }
    if (priceMin.value) {
        query.minPrice = priceMin.value;
    }
    if (priceMax.value) {
        query.maxPrice = priceMax.value;
    }
    if (searchValue.value) {
        query.search = searchValue.value;
    }
    if (sort.value) {
        let sortArr = sort.value.split('=');
        if (sortArr[0] == "date") {
            query.date = sortArr[1];
        }
        if (sortArr[0] == "price") {
            query.price = sortArr[1];
        }
    }

    query.options = [];
    for (const key in multiselectValue.value) {
        if (multiselectValue.value[key].length === 0) {
        } else {
            multiselectValue.value[key].forEach(el => {
                query.options.push(el.id);
            })
        }
    }
    for (const key in selectValue.value) {
        if (selectValue.value[key].length === 0) {
        } else {
            query.options.push(selectValue.value[key]);
        }
    }
    getProducts(query)

    router.push({
        name: 'search',
        query: query,
    })
}

const getQuery = (query) => {
    console.log(query);
    query.categoryId ? getCategories(query.categoryId) : getCategories()

    if (query.maxPrice) {
        priceMax.value = query.maxPrice;
    }
    if (query.minPrice) {
        priceMin.value = query.minPrice;
    }

    if (query.date) {
        query.date == 'desc' ? sort.value = 'date=desc' : sort.value = 'date=asc'
    }
    if (query.price) {
        query.price == 'desc' ? sort.value = 'price=desc' : sort.value = 'price=asc'
    }
    if (query.search) {
        searchValue.value = query.search;
    }
    console.log(sort.value);
}

const getCategories = async (data = null) => {
    try {
        let query = '';
        if (data) {
            query = `/${data}`
        }
        let result = await axiosInstance.get(`api/categories${query}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        data ? categories.value = result.data.data : categories.value = result.data
        console.log(categories.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getProducts = async (data = null) => {
    try {
        let query = '';
        if (data) {
            query += `?`
            if (data.categoryId) {
                query += `categoryId=${data.categoryId}&`
            }
            if (data.search) {
                query += `search=${data.search}&`
            }
            if (data.options) {
                query += `options=${data.options}&`
            }
            if (data.minPrice) {
                query += `minPrice=${data.minPrice}&`
            }
            if (data.maxPrice) {
                query += `maxPrice=${data.maxPrice}&`
            }
            if (data.date) {
                query += `date=${data.date}&`
            }
            if (data.price) {
                query += `price=${data.price}&`
            }
        }
        let result = await axiosInstance.get(`api/products${query}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        products.value = result.data;

        console.log(products.value);
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

onMounted(() => {
    getQuery(route.query)

    getProducts(
        {
            'categoryId': route.query.categoryId,
            'search': route.query.search,
            'options': route.query.options,
            'priceMin': route.query.priceMin,
            'priceMax': route.query.priceMax,
            'date': route.query.date,
            'price': route.query.price,
        })
})

</script>
<style>
.cursor-pointer {
    cursor: pointer;
}
</style>
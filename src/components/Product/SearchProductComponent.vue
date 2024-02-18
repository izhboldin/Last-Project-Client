<template>
    <div class="py-4">
        <div class="container pb-4">
            <div class="input-group">
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" v-model="searchValue">
                <button class="btn btn-danger" type="button" @click="deleteSearch()">X</button>
                <button class="btn btn-info" type="button" @click="search()">Поиск</button>
            </div>
        </div>
        <template v-if="categories">
            <div class="w-100">
                <div class="container">
                    <h4><strong>Фильтры</strong></h4>
                    <!-- <pre>{{ categories }}</pre> -->
                    <!-- <div class="row row-cols-2 row-cols-lg-5 g-3 g-lg-3"> -->
                    <div class="row g-3">

                        <div class="col-5">
                            <div class="p-2 ">
                                <label for="exampleInputEmail1" class="form-label mb-0">Категория</label>
                                <treeselect v-model="valueCategoryId" :multiple="false" :options="categoriesTree" />
                                <!-- <button v-if="!(route.query.categoryId)" class="form-control">Все категории</button> -->
                                <!-- <button v-if="(route.query.categoryId)" class="form-control">{{ categories.name }}</button> -->
                            </div>
                        </div>

                        <div class="col-4">
                            <label for="exampleInputEmail1" class="form-label mb-0">Цена</label>
                            <div class="p-2  input-group">
                                <input type="number" class="form-control" placeholder="От:" v-model="priceMin">
                                <input type="number" class="form-control" placeholder="До:" v-model="priceMax">
                            </div>
                        </div>
                        <div class="col-3">
                            <label for="exampleInputEmail1" class="form-label mb-0">Состояние</label>
                            <div class="p-2  input-group">
                                <select class="form-control" v-model="stateValue">
                                    <option value="">-</option>
                                    <option value="second-hand">Б/у</option>
                                    <option value="new">Новый</option>
                                </select>
                            </div>
                        </div>
                        <div v-for="parameter in categories.parameters" class="col-3">
                            <label for="exampleInputEmail1" class="form-label mb-0">{{ parameter.name }}</label>
                            <div class="p-2  input-group">
                                <select v-if="parameter.type == 'select'" class="form-control"
                                    v-model="selectValue[parameter.id]">
                                    <option value="">-</option>
                                    <option v-for="option in parameter.options" :value="option.id">{{ option.name }}
                                    </option>
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
                <div v-if="products" class="container">
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
                    <!-- <pre>{{ products }}</pre> -->
                    <div class="row g-2">

                        <div v-for="product in products.data" class="col-3 my-3">
                            <div @click="router.push({ name: 'product', params: { id: product.id } })"
                                class="cursor-pointer p-3 bg-body">
                                <img v-if="product.images[0]" v-bind:src="product.images[0].full_url" class="card-img"
                                    alt="..." style="height: 26vh; object-fit: cover">
                                <img v-if="!product.images[0]"
                                    src="http://localhost:8080/storage/images/no_image_available.png" class="card-img"
                                    alt="..." style="height: 26vh; object-fit: cover">
                                <small class="py-2 blockquote-footer">{{ product.category.name }}</small>
                                <h4 class="py-2 ">{{ product.title }}</h4>
                                <h6><strong>{{ product.price }} грн.</strong></h6>

                            </div>
                        </div>
                        <h4 class="text-center p-5" v-if="!products.data || !products.data.length">Объявления не найдены
                        </h4>

                        <div class="">
                            <Paginator v-model:first="paginate" :rows="products.meta.per_page" :totalRecords="products.meta.total">
                            </Paginator>
                        </div>

                    </div>
                </div>
            </div>
        </template>

        <h3 class="text-center p-5" v-if="!categories">Загрузка</h3>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/services/axios.js';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js';

import MultiSelect from 'primevue/multiselect';
import Paginator from 'primevue/paginator';

import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const categoriesTree = ref(null);
const paginate = ref(2);
const paginatePage = ref(1);

const { getToken } = storeToRefs(useAuthStore());

const route = useRoute();
const router = useRouter();

const categories = ref(null);
const valueCategoryId = ref(null);
const oldValueCategoryId = ref(null);
const isEqualValueCategoryId = ref(true);
const allCategories = ref(null);
const products = ref(null);
const searchInput = ref(null);
const priceMin = ref(null);
const priceMax = ref(null);
const searchValue = ref(null);
const stateValue = ref(null);

const multiselectValue = ref({});
const selectValue = ref({});
const sort = ref('');

watch(categories, newValue => {
    multiselectValue.value = {};
    selectValue.value = {};
    if (Array.isArray(newValue) || !newValue) {
        return
    }
    // заполнение объектов опций ключами
    newValue.parameters.forEach(element => {
        if (element.type === 'multiselect') {
            multiselectValue.value[`${element.id}`] = [];
        }
        if (element.type === 'select') {
            selectValue.value[`${element.id}`] = '';
        }
    });

    setOptionsFromQuery(route.query.options);
})

watch(paginate, newValue => {
    search()
})

//заполение объектов опций значениеми из квери-параметров
const setOptionsFromQuery = (queryOption) => {
    if (categories.value == null) {
        return;
    }
    if (queryOption && categories.value.parameters) {
        let optionsArr = queryOption;
        if (!(Array.isArray(optionsArr))) {
            optionsArr = [parseInt(queryOption)]
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
}

watch(allCategories, newValue => {
    categoriesTree.value = transformCategoriesTree(newValue);
})

watch(valueCategoryId, newValue => {

    if (oldValueCategoryId.value === null) {
        oldValueCategoryId.value = newValue;
        return
    }

    oldValueCategoryId.value !== newValue ? isEqualValueCategoryId.value = false : isEqualValueCategoryId.value = true;

    // if (oldValueCategoryId.value !== newValue) {
    //     let currentParams = route.query
    //     currentParams.categoryId = newValue
    //     delete currentParams.options;
    //     router.push({
    //         name: 'search',
    //         query: currentParams    ,
    //     })

    //     // router.replace({ query: currentParams });
    //     getProducts(currentParams)
    //     getCategories(newValue)
    // }

    oldValueCategoryId.value = newValue;
})

const transformCategoriesTree = (categories) => {

    if (Array.isArray(categories)) {
        return categories.map(category => {
            const transformedCategory = {
                label: category.name,
                id: category.id,
                parent_category_id: category.parent_category_id,
            };

            if (category.children && category.children.length > 0) {
                transformedCategory.children = transformCategoriesTree(category.children);
            }

            return transformedCategory;
        });
    } else {

        const transformedCategory = {
            label: categories.name,
            id: categories.id,
            parent_category_id: categories.parent_category_id,
        };

        if (categories.children && categories.children.length > 0) {
            transformedCategory.children = transformCategoriesTree(categories.children);
        }

        return [transformedCategory]
    }
}


const search = () => {
    let query = {};
    if (valueCategoryId.value) {
        if (valueCategoryId.value != route.query.categoryId) {
            multiselectValue.value = {};
            selectValue.value = {};
        }
        query.categoryId = valueCategoryId.value;
        getCategories(valueCategoryId.value)
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
    if (stateValue.value) {
        query.state = stateValue.value;
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

    if (paginate.value && products.value) {
        if (paginate.value < products.value.meta.per_page) {
            query.page = 1
        }
        else {
            query.page = (paginate.value / products.value.meta.per_page) + 1;;
        }
    }

    query.options = getOptionsArr();
    // if (isEqualValueCategoryId.value === true) {

    // }

    getProducts(query)
    // getCategories(newValue)

    router.push({
        name: 'search',
        query: query,
    })
}

const getOptionsArr = () => {
    let query = {};
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

    return query.options;
}

const deleteSearch = () => {
    searchValue.value = ''
    search();
}

const getQuery = (query) => {


    if (query.categoryId) {
        valueCategoryId.value = query.categoryId;
    }
    if (query.options) {
        setOptionsFromQuery(query.options);
    }

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
    if (query.state) {
        stateValue.value = query.state;
    }
    // if (query.page) {
    //     paginatePage.value = query.page;
    // }
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
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
}

const getAllCategories = async () => {
    try {
        let result = await axiosInstance.get(`api/categories`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        allCategories.value = result.data
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
            if (data.state) {
                query += `state=${data.state}&`
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
            if (data.page) {
                query += `page=${data.page}&`
            }
        }
        let result = await axiosInstance.get(`api/products${query}`, {
            headers: {
                'Authorization': `Bearer ${getToken.value}`,
            }
        });
        products.value = result.data;
console.log(result.data);
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
            'state': route.query.state,
            'options': route.query.options,
            'priceMin': route.query.priceMin,
            'priceMax': route.query.priceMax,
            'date': route.query.date,
            'price': route.query.price,
            'page': route.query.page,
        })

    getAllCategories()
})

</script>
<style>
.cursor-pointer {
    cursor: pointer;
}
</style>
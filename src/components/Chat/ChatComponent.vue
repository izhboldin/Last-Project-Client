<template>
    <div class="py-4">
        <div class="container">
            <div class="row g-3">

                <div class="col-4">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <div class="mb-2">
                            <button class="btn btn-info me-3" type="button">Покупаю</button>
                            <button class="btn btn-outline-info" type="button">Продаю</button>
                        </div>
                        <div>

                            <div class="w-100 bg-light p-2 mb-2">
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

                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <div class="p-3 bg-body mb-3" style="min-height: 80vh">
                        <div class="d-flex m-2 mb-3">
                            <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                style="height: 42px; width: 42px;" alt=""
                                class="img-fluid object-fit-cover rounded-circle me-3">
                            <div>
                                <h5 class="my-1">саня</h5>
                                <!-- <p><small>qwe</small></p> -->
                            </div>
                        </div>



                        <div class="w-100 bg-light p-3 flex-column-reverse mb-3" style="min-height: calc(70vh - 56px)">
                            <div class="row h-100 justify-content-between">

                                <div class="row justify-content-start mb-2">

                                    <div class="d-flex">
                                        <img src="https://lh3.googleusercontent.com/ogw/ANLem4afL67FThoAbnFlPCV9H4ZDAwh-v8UILFH30VLztg=s32-c-mo"
                                            style="height: 42px; width: 42px;" alt=""
                                            class="img-fluid object-fit-cover rounded-circle me-3">
                                        <div class="col-md-7 bg-secondary p-2 rounded">
                                            
                                            <h6 class="m-0">Привет</h6>
                                            <p class="my-0 d-flex justify-content-end fw-light ">20:35</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="row justify-content-end">
                                    <div class="d-flex justify-content-end">

                                        <div class="col-md-7 bg-primary p-2 rounded">
                                            <h6 class="m-0">Иди нахуй</h6>
                                            <p class="my-0 d-flex justify-content-end fw-light ">20:35</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="w-100 ">
                            <div class="row">
                                <div class="col-8">
                                    <input  type="text" class="w-100 form-control">
                                </div>
                                <div class="col-4">
                                    <button class="w-100 btn btn-info">отправить</button>
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





</script>
<style>
.flex-column-reverse {
      display: flex;
      flex-direction: column-reverse;
    }
</style>
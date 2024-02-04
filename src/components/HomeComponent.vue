<template>
    <div class="bg-light w100 py-3">

        <div class="container my-2">
            <div class="input-group">
                <input type="text" class="form-control  p-3" placeholder="Recipient's username" aria-label="Recipient's username"
                    aria-describedby="button-addon2">
                <button class="btn btn-info" type="button" id="button-addon2">Button</button>
            </div>
        </div>
        <div class="card-body py-2">
                <RouterView />
            </div>
    </div>
</template>
<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'


</script>
<style></style>
<template>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <button v-show="!userLoaded" class="btn btn-dark" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    </div>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded placeholder-img" :src="user.data.cover"
                                height="250" width="250" />
                            <div class="position-absolute bottom-0">
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <router-link to="/profile">
                            <h1 class="text-bold mb-2" style="font-size: 32px; font-weight: 700;">{{ user.data.name }}
                            </h1>
                        </router-link>
                        <router-link to="/settings" class="btn btn-outline-dark fw-bolder">Settings</router-link>
                    </div>
                    <hr />
                    <router-view @right-click="emit('right-click', $event)"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from "/js/store.js";

const emit = defineEmits(["right-click"]);

const user = ref(store.profile);
const userLoaded = ref(false);

async function get_user() {
    DZ.api(`/user/me?access_token=${localStorage.getItem("token")}`, function (response) {
        user.value.data = {
            id: parseInt(response.id),
            name: response.name,
            cover: response.picture_medium,
            country: response.country
        }
    });
    userLoaded.value = true;
    store.profile_loaded = true;
}

onMounted(() => {
    if (!store.profile_loaded) {
        get_user();
        return;
    }
    userLoaded.value = true;
})
</script>
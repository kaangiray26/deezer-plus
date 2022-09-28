<template>
    <div class="container-fluid" style="height: 100%;width: 100%;margin: 0px;padding: 0px;">
        <div class="card" style="width: 100%;">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <router-link to="/" class="page-heading-link hover-color me-2 disabled"
                        style="padding: 0.25em;font-family: 'Secular One', sans-serif; cursor: pointer;">
                        <div class="d-inline-flex position-relative ratio-1x1">
                            <img src="/assets/Deezer_Logo_RVB_Black.svg" style="height:24px">
                        </div>
                    </router-link>
                    <div class="input-group"><span class="input-group-text bi bi-search"
                            style="background: transparent;border-right-style: none;"></span><input class="form-control"
                            type="text" id="searchField" placeholder="Search"
                            style="background: transparent;border-left-style: none;" autocomplete="off"
                            @keyup.enter="search($event)">
                    </div>
                    <div class="ms-2">
                        <button type="button" class="btn btn-dark" @click="openProfile">
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <router-view @right-click="$emit('right-click', $event)" />
    </div>
</template>

<script setup>
import router from "/router";

async function openProfile() {
    router.push("/profile");
}

async function search(event) {
    if (!event.target.value.length) {
        return;
    }
    router.push("/search/" + event.target.value);
}
</script>
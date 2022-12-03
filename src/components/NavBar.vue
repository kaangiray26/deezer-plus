<template>
    <div class="card">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <router-link to="/" class="page-heading-link hide-on-mobile hover-color me-2 disabled"
                    style="padding: 0.25em; cursor: pointer;">
                    <div class="d-inline-flex position-relative ratio-1x1">
                        <img src="/assets/Deezer_Logo_RVB_Black.svg" style="height:24px">
                    </div>
                </router-link>
                <router-link to="/" class="page-heading-link hide-on-desktop hover-color me-2 disabled"
                    style="padding: 0.25em; cursor: pointer;">
                    <img src="../assets/deezer.svg" style="height:24px">
                </router-link>
                <div class="input-group flex-nowrap me-2">
                    <span class="input-group-text bi bi-search"
                        style="background: transparent;border-right-style: none;">
                    </span>
                    <input ref="search_input" class="form-control" type="text" id="searchField" placeholder="Search"
                        style="background: transparent;border-left-style: none;" autocomplete="off"
                        @keyup.enter="search($event)">
                </div>
                <div>
                    <button id="usernameTooltip" type="button" class="btn btn-dark position-relative hide-on-mobile"
                        data-bs-toggle="tooltip" :data-bs-title="username" @click="openProfile">
                        Profile
                    </button>
                    <button type="button" class="btn btn-dark bi bi-person-fill position-relative hide-on-desktop"
                        @click="openProfile">
                    </button>
                </div>
            </div>
        </div>
    </div>
    <router-view @right-click="emit('right-click', $event)" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Tooltip } from 'bootstrap';
import router from "/router";

const emit = defineEmits(["right-click"]);

let search_input = ref(null);

async function openProfile() {
    router.push('/profile');
}

async function search(event) {
    if (!event.target.value.length) {
        return;
    }
    router.push('/search/' + event.target.value);
}

async function _focus_search() {
    search_input.value.value = "";
    search_input.value.focus();
}

const username = computed(() => {
    return localStorage.getItem('username');
});

defineExpose({
    focus_search: _focus_search,
});

onMounted(() => {
    new Tooltip(document.getElementById('usernameTooltip'), {
        'placement': 'bottom',
        'trigger': 'hover',
    });
})
</script>
<template>
    <Modal ref="thisModal" @requestLogin="login"></Modal>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Modal from "./LoginModal.vue";

let thisModal = ref(null);

function showModal() {
    thisModal.value.show();
}

function hideModal() {
    thisModal.value.hide();
}

function getLoginStatus(response) {
    let token = sessionStorage.getItem("token");
    if (token == null) {
        showModal();
        return;
    }
    hideModal();
}

function login() {
    DZ.login(function (response) {
        if (response.authResponse) {
            sessionStorage.setItem('id', response.authResponse.userID);
            sessionStorage.setItem('token', response.authResponse.accessToken);
            hideModal();
            location.reload();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history' });
}

onBeforeMount(() => {
    DZ.init({
        // appId: '559022',
        // channelUrl: 'http://localhost:8000/channel.html',
        appId: '560962',
        channelUrl: 'https://deezer.buzl.uk/channel.html',
        player: {
            onload: getLoginStatus
        }
    });
})
</script>
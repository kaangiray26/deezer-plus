<template>
    <Modal ref="thisModal" @requestLogin="login"></Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "./LoginModal.vue";

let thisModal = ref(null);

DZ.init({
    appId: '559022',
    channelUrl: 'http://localhost:8000/channel.html',
    player: {
        onload: getLoginStatus
    }
});

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
        hideModal();
        if (response.authResponse) {
            sessionStorage.setItem('id', response.authResponse.userID);
            sessionStorage.setItem('token', response.authResponse.accessToken);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history' });
}
</script>
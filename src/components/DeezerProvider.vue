<template>
    <Modal ref="thisModal" @requestLogin="login"></Modal>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import router from "/router";
import Modal from "/components/LoginModal.vue";

let thisModal = ref(null);

function showModal() {
    thisModal.value.show();
}

function hideModal() {
    thisModal.value.hide();
}

function getLoginStatus(response) {
    let token = localStorage.getItem("token");
    if (token == null) {
        showModal();
        return;
    }
    hideModal();
    DZ.player.setVolume(100);
    DZ.player.setShuffle(false);
}

function login() {
    DZ.login(function (response) {
        if (response.authResponse) {
            localStorage.setItem('id', response.userID);
            localStorage.setItem('token', response.authResponse.accessToken);
            hideModal();
            location.reload();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history' });
}

onBeforeMount(() => {
    let appId = '560962';
    let channelUrl = 'https://deezer.buzl.uk/channel.html';

    if (window.location.hostname == 'localhost') {
        appId = '559022';
        channelUrl = 'http://localhost:8000/channel.html';
    }

    DZ.init({
        appId: appId,
        channelUrl: channelUrl,
        player: {
            onload: getLoginStatus
        }
    });
})
</script>
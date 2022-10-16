<template>
    <Modal ref="thisModal" @requestLogin="login"></Modal>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Modal from "/components/LoginModal.vue";

let thisModal = ref(null);

const favs = ref({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
    radios: []
});

async function save_favorites() {
    get_fav_tracks();
    get_fav_albums();
    get_fav_artists();
    get_fav_playlists();
    get_fav_radios();
}

async function get_fav_tracks(url = null) {
    if (!url) {
        url = `/user/me/tracks?access_token=${localStorage.getItem("token")}`;
    }

    DZ.api(url, function (response) {
        response.data.map(item => {
            favs.value.tracks.push(item.id)
        });

        if (response.next) {
            get_fav_tracks(response.next.split("https://api.deezer.com")[1]);
        } else {
            localStorage.setItem('fav_tracks', JSON.stringify(favs.value.tracks));
        }
    });
}

async function get_fav_albums(url = null) {
    if (!url) {
        url = `/user/me/albums?access_token=${localStorage.getItem("token")}`;
    }

    DZ.api(url, function (response) {
        response.data.map(item => {
            favs.value.albums.push(item.id)
        });

        if (response.next) {
            get_fav_albums(response.next.split("https://api.deezer.com")[1]);
        } else {
            localStorage.setItem('fav_albums', JSON.stringify(favs.value.albums));
        }
    });
}

async function get_fav_artists(url = null) {
    if (!url) {
        url = `/user/me/artists?access_token=${localStorage.getItem("token")}`;
    }

    DZ.api(url, function (response) {
        response.data.map(item => {
            favs.value.artists.push(item.id)
        });

        if (response.next) {
            get_fav_artists(response.next.split("https://api.deezer.com")[1]);
        } else {
            localStorage.setItem('fav_artists', JSON.stringify(favs.value.artists));
        }
    });
}

async function get_fav_playlists(url = null) {
    if (!url) {
        url = `/user/me/playlists?access_token=${localStorage.getItem("token")}`;
    }

    DZ.api(url, function (response) {
        response.data.map(item => {
            favs.value.playlists.push(item.id)
        });

        if (response.next) {
            get_fav_playlists(response.next.split("https://api.deezer.com")[1]);
        } else {
            localStorage.setItem('fav_playlists', JSON.stringify(favs.value.playlists));
        }
    });
}

async function get_fav_radios(url = null) {
    if (!url) {
        url = `/user/me/radios?access_token=${localStorage.getItem("token")}`;
    }

    DZ.api(url, function (response) {
        response.data.map(item => {
            favs.value.radios.push(item.id)
        });

        if (response.next) {
            get_fav_radios(response.next.split("https://api.deezer.com")[1]);
        } else {
            localStorage.setItem('fav_radios', JSON.stringify(favs.value.radios));
        }
    });
}

function showModal() {
    thisModal.value.show();
}

function hideModal() {
    thisModal.value.hide();
}

async function getLoginStatus(response) {
    let token = localStorage.getItem("token");
    if (!token) {
        showModal();
        return;
    }
    hideModal();
    DZ.player.setVolume(100);
    DZ.player.setShuffle(false);
    await save_favorites();
}

function login() {
    DZ.login(function (response) {
        if (!response.authResponse.accessToken) {
            alert('Login failed, please try again later.');
            return;
        }

        console.log("Welcome!  Fetching your information.... ", response.authResponse);
        localStorage.setItem('token', response.authResponse.accessToken);
        localStorage.setItem('scrobbling', false);

        localStorage.setItem('queue', JSON.stringify([]));
        localStorage.setItem('groupSession', JSON.stringify([]));
        localStorage.setItem('groupSessionID', '');

        localStorage.setItem('fav_tracks', JSON.stringify([]));
        localStorage.setItem('fav_albums', JSON.stringify([]));
        localStorage.setItem('fav_artists', JSON.stringify([]));
        localStorage.setItem('fav_playlists', JSON.stringify([]));
        localStorage.setItem('fav_radios', JSON.stringify([]));

        DZ.api(`/user/me?access_token=${localStorage.getItem("token")}`, data => {
            localStorage.setItem('id', data.id);
            localStorage.setItem('username', data.name);
            hideModal();
            location.reload();
        });
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
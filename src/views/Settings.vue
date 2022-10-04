<template>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <button v-show="!settingsLoaded" class="btn btn-dark" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    </div>
    <div v-show="settingsLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <div class="position-absolute bottom-0">
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <router-link to="/settings">
                            <h1 class="text-bold mb-2" style="font-size: 32px; font-weight: 700;">Settings</h1>
                        </router-link>
                    </div>
                    <hr />
                    <div class="d-flex flex-column ">
                        <div class="d-flex justify-content-start mb-4">
                            <img class="img-fluid figure-img rounded" src="/assets/Lastfm_logo.svg"
                                style="height: 32px;">
                        </div>
                        <div v-show="!settings.lastfm.connected" class="input-group">
                            <button class="btn btn-outline-dark" @click="lastfm_auth">Connect to Last.fm</button>
                        </div>
                        <table v-show="settings.lastfm.connected" class="table table-hover">
                            <tbody>
                                <tr>
                                    <td>Username:</td>
                                    <td class="fw-bolder">{{settings.lastfm.name}}</td>
                                </tr>
                                <tr>
                                    <td>updateNowPlaying:</td>
                                    <td>
                                        <button class="btn"
                                            :class="{ 'btn-outline-danger': !store.scrobbling, 'btn-outline-success': store.scrobbling }"
                                            @click="toggleScrobbling">{{store.scrobbling
                                            ? 'Enabled' : 'Disabled'}}</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button class="btn btn-outline-danger"
                                            @click="lastfm_disconnect">Disconnect</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from '/js/store.js';

const settingsLoaded = ref(false);

const settings = ref({
    lastfm: {
        connected: false,
    }
});

async function lastfm_auth() {
    window.location = 'http://www.last.fm/api/auth/?api_key=f69c106b53203ed9fd98fd12dccfff43';
}

async function lastfm_disconnect() {
    localStorage.removeItem('lastfm');
    location.reload();
}

async function toggleScrobbling() {
    store.scrobbling = !store.scrobbling;
    localStorage.setItem('scrobbling', store.scrobbling);
}

async function displayLastfm() {
    store.scrobbling = JSON.parse(localStorage.getItem('scrobbling'));
    let data = JSON.parse(localStorage.getItem('lastfm'));
    data['connected'] = true;
    settings.value.lastfm = data;
}

onMounted(() => {
    if (localStorage.getItem('lastfm')) {
        displayLastfm();
    }
    settingsLoaded.value = true;
});
</script>
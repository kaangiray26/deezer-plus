<template>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <button v-show="!radioLoaded" class="btn btn-dark" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    </div>
    <div v-show="radioLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="radio.cover" />
                            <div class="position-absolute bottom-0">
                                <button v-show="isFav" class="btn btn-light shadow bi bi-heart-fill text-danger"
                                    type="button" style="opacity: 0.90;"
                                    @click="isFav = !isFav; removeFromFav('fav_radios', radio.id); notify({n:'Removed from favorites.'})">
                                </button>
                                <button v-show="!isFav" class="btn btn-light shadow bi bi-heart" type="button"
                                    style="opacity: 0.90;"
                                    @click="isFav = !isFav; addToFav('fav_radios', radio.id); notify({n:'Added to favorites.'})">
                                </button>
                                <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                                    @click="play(radio.id)">
                                </button>
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-2" style="font-size: 32px; font-weight: 700;">{{radio.title}}</h1>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                <th class="col-6 d-flex align-items-center">Track</th>
                                <th class="col-2 d-flex align-items-center">Artist</th>
                                <th class="col-3 d-flex align-items-center">Album</th>
                                <th class="col-1 bi bi-clock-fill d-flex align-items-center justify-content-end"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="track in tracks" :track_id="track.id" :album_id="track.album.id"
                                :artist_id="track.artist.id" class="row gx-0 d-flex flex-row"
                                @contextmenu.prevent="emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                type="tracks" style="flex-wrap: nowrap; width: 100% !important;">
                                <td class="col-6 d-flex align-items-center text-nowrap text-truncate">
                                    <div><img class="img-fluid" :src="track.album.cover_small" width="40" height="40" />
                                        <button class="btn btn-link track-link"
                                            @click="playTrack(track.id)">{{track.title}}</button>
                                    </div>
                                </td>
                                <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
                                    <div>
                                        <router-link :to="/artist/+track.artist.id" @click="emit('route-click')">
                                            {{track.artist.name}}</router-link>
                                    </div>
                                </td>
                                <td class="col-3 d-flex align-items-center text-nowrap text-truncate">
                                    <div>
                                        <router-link :to="/album/+track.album.id" @click="emit('route-click')">
                                            {{track.album.title}}</router-link>
                                    </div>
                                </td>
                                <td
                                    class="col-1 d-flex align-items-center justify-content-end text-nowrap text-truncate">
                                    {{Math.floor(track.duration/60)}}:{{padWithZero(track.duration % 60)}}
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { notify } from '/js/store.js';
import router from "/router";

import { sessionAction } from '/js/session.js';
import { addToQueueStart, getQueueTracks } from '/js/queue.js';

import { addToFav, removeFromFav } from "/js/favs.js";

const emit = defineEmits(["right-click", "route-click"]);

const radio = ref({});
const tracks = ref([]);

const radioLoaded = ref(false);
const isFav = ref(false);

async function get_radio(id) {
    DZ.api('/radio/' + id, function (response) {
        radio.value = {
            id: parseInt(response.id),
            title: response.title,
            description: response.description,
            cover: response.picture_medium,
        }
    });
    isFav.value = JSON.parse(localStorage.getItem('fav_radios')).includes(parseInt(id));
}

async function get_tracks(id) {
    DZ.api(`/radio/${id}/tracks`, function (response) {
        tracks.value = response.data;
    });
    radioLoaded.value = true;
}

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

// Must be synchronized in groupSession: ok
async function playTrack(id) {
    sessionAction({
        func: async function op() {
            await addToQueueStart([parseInt(id)]);
            getQueueTracks().then(tracks => {
                DZ.player.playTracks(tracks);
            });
        },
        object: id,
        operation: 'Track.play',
    });
}

// Must be synchronized in groupSession: ok
async function play(id) {
    notify({ n: "Loading radio..." });
    sessionAction({
        func: async function op() {
            DZ.api(`/radio/${id}/tracks`, async function (response) {
                await addToQueueStart(response.data.map(item => parseInt(item.id)));
                getQueueTracks().then(tracks => {
                    DZ.player.playTracks(tracks);
                });
            });
        },
        object: id,
        operation: 'Radio.play',
    });
}

onMounted(() => {
    get_radio(router.currentRoute.value.params.id);
    get_tracks(router.currentRoute.value.params.id);
});
</script>
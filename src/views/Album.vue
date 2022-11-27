<template>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <button v-show="!albumLoaded" class="btn btn-dark" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    </div>
    <div v-show="albumLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="album.cover" />
                            <div class="position-absolute bottom-0">
                                <button v-show="isFav" class="btn btn-light shadow bi bi-heart-fill text-danger"
                                    type="button" style="opacity: 0.90;"
                                    @click="isFav = !isFav; removeFromFav('fav_albums', album.id); notify({ n: 'Removed from favorites.' })">
                                </button>
                                <button v-show="!isFav" class="btn btn-light shadow bi bi-heart" type="button"
                                    style="opacity: 0.90;"
                                    @click="isFav = !isFav; addToFav('fav_albums', album.id); notify({ n: 'Added to favorites.' })">
                                </button>
                                <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                                    @click="play(album.id)">
                                </button>
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-4" style="font-size: 32px; font-weight: 700;">{{ album.title }}</h1>
                        <div class="d-inline-flex align-content-center align-items-center mb-2">
                            <router-link :to="/artist/ + album.artist_id">
                                <img class="img-fluid figure-img rounded" :src="album.artist_cover"
                                    style="width:28px;height: 28px;">
                            </router-link>
                            <router-link :to="/artist/ + album.artist_id">
                                <span class="mx-2">{{ album.artist_name }}</span>
                            </router-link>
                        </div>
                        <p class="mb-0">
                            <small class="text-muted">{{ album.release_date }} - {{ album.nb_tracks }} tracks -
                                {{ Math.floor(album.duration /
                                        60)
                                }} mins - {{ album.fans }} fans
                            </small>
                        </p>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                <th class="col-1">#</th>
                                <th class="col-10">Track</th>
                                <th class="col-1 bi bi-clock-fill"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(track, index) in album.tracks" :track_id="track.id" :album_id="album.id"
                                :artist_id="album.artist_id" class="row gx-0 d-flex flex-row"
                                :class="{ 'table-warning': track.id == redirected_track_id }"
                                @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })"
                                type="tracks" style="flex-wrap: nowrap; width: 100% !important;">
                                <td class="col-1 d-flex align-items-center text-nowrap text-truncate">{{ index + 1 }}
                                </td>
                                <td class="col-10 d-flex align-items-center text-nowrap text-truncate"><button
                                        :id="track.id" class="btn btn-link track-link px-0"
                                        @click="playTrack(track.id)">{{ track.title }}</button></td>
                                <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
                                    {{ Math.floor(track.duration / 60) }}:{{ padWithZero(track.duration % 60) }}</td>
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

const emit = defineEmits(["right-click"]);

const album = ref({});
const albumLoaded = ref(false);

const redirected_track_id = ref(null);

const isFav = ref(false);

async function get_album(id) {
    DZ.api('/album/' + id, function (response) {
        album.value = {
            id: parseInt(response.id),
            title: response.title,
            artist_name: response.artist.name,
            artist_id: parseInt(response.artist.id),
            artist_cover: response.artist.picture_medium,
            cover: response.cover_medium,
            duration: response.duration,
            explicit_lyrics: response.explicit_lyrics,
            fans: numberWithCommas(response.fans),
            nb_tracks: response.nb_tracks,
            release_date: formatDate(response.release_date),
            tracks: response.tracks.data
        }
    });
    isFav.value = JSON.parse(localStorage.getItem('fav_albums')).includes(parseInt(id));
    albumLoaded.value = true;
}

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

function formatDate(date) {
    let date_arr = date.split('-');
    date_arr.reverse();
    return date_arr.join("/")
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    notify({ n: "Loading album..." });
    sessionAction({
        func: async function op() {
            DZ.player.playAlbum(parseInt(id));
            DZ.api('/album/' + id, async function (response) {
                await addToQueueStart(response.tracks.data.map(item => parseInt(item.id)));
            });
        },
        object: id,
        operation: 'Album.play',
    });
}

onMounted(() => {
    if (router.currentRoute.value.query.hasOwnProperty('track')) {
        redirected_track_id.value = parseInt(router.currentRoute.value.query.track);
    }
    get_album(router.currentRoute.value.params.id);
});
</script>
<template>
    <div class="row justify-content-center gx-0">
        <div class="card col-11">
            <button v-show="!playlistLoaded" class="btn btn-dark" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    </div>
    <div v-show="playlistLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="playlist.cover" />
                            <div class="position-absolute bottom-0">
                                <button v-show="isFav" class="btn btn-light shadow bi bi-heart-fill text-danger"
                                    type="button" style="opacity: 0.90;"
                                    @click="isFav = !isFav; removeFromFav('fav_playlists', playlist.id)">
                                </button>
                                <button v-show="!isFav" class="btn btn-light shadow bi bi-heart" type="button"
                                    style="opacity: 0.90;"
                                    @click="isFav = !isFav; addToFav('fav_playlists', playlist.id)">
                                </button>
                                <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                                    @click="play(playlist.id)">
                                </button>
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-4" style="font-size: 32px; font-weight: 700;">{{playlist.title}}</h1>
                        <div class="d-inline-flex">
                            <router-link :to="/user/+playlist.creator_id" class="d-inline-flex"
                                style="display: revert !important;">
                                <mark>
                                    {{playlist.creator_name}}
                                </mark>
                            </router-link>
                        </div>
                        <div class="d-flex mb-2">
                            <span>
                                {{playlist.description}}
                            </span>
                        </div>
                        <p class="mb-0">
                            <small class="text-muted">{{playlist.nb_tracks}} tracks - {{playlist.duration}} -
                                {{playlist.fans}} fans
                            </small>
                        </p>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                <th class="col-6">Track</th>
                                <th class="col-2">Artist</th>
                                <th class="col-3">Album</th>
                                <th class="col-1 bi bi-clock-fill"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="track in playlist.tracks" :track_id="track.id" :album_id="track.album.id"
                                :artist_id="track.artist.id" class="row gx-0 d-flex flex-row"
                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                type="tracks" style="flex-wrap: nowrap; width: 100% !important;">
                                <td class="col-6 text-nowrap text-truncate">
                                    <div><img class="img-fluid" :src="track.album.cover_small" width="40" height="40" />
                                        <button class="btn btn-link track-link"
                                            @click="playTrack(track.id)">{{track.title}}</button>
                                    </div>
                                </td>
                                <td class="col-2 text-nowrap text-truncate">
                                    <div>
                                        <router-link :to="/artist/+track.artist.id" @click="$emit('route-click')">
                                            {{track.artist.name}}</router-link>
                                    </div>
                                </td>
                                <td class="col-3 text-nowrap text-truncate">
                                    <div>
                                        <router-link :to="/album/+track.album.id" @click="$emit('route-click')">
                                            {{track.album.title}}</router-link>
                                    </div>
                                </td>
                                <td class="col-1 text-nowrap text-truncate">
                                    {{Math.floor(track.duration/60)}}:{{padWithZero(track.duration % 60)}}</td>
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
import { addToFav } from "../js/favs";
import router from "../router";

const playlist = ref({});
const playlistLoaded = ref(false);

const isFav = ref(false);

async function get_playlist(id) {
    DZ.api('/playlist/' + id, function (response) {
        playlist.value = {
            id: parseInt(response.id),
            title: response.title,
            description: response.description,
            duration: formatDuration(response.duration),
            nb_tracks: response.nb_tracks,
            fans: numberWithCommas(response.fans),
            cover: response.picture_medium,
            creator_id: parseInt(response.creator.id),
            creator_name: response.creator.name,
            tracks: response.tracks.data
        }
        isFav.value = JSON.parse(localStorage.getItem('fav_playlists')).includes(parseInt(id));
        playlistLoaded.value = true;
    });
}

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

function formatDuration(num) {
    if (num > 3600) {
        return Math.floor(num / 3600) + " hrs " + Math.floor((num % 3600) / 60) + " mins";
    }
    return (num % 3600) / 60 + " mins";
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function playTrack(id) {
    DZ.player.playTracks([parseInt(id)]);
}

async function play(id) {
    DZ.player.playPlaylist(id);
}

onMounted(() => {
    get_playlist(router.currentRoute.value.params.id);
})
</script>
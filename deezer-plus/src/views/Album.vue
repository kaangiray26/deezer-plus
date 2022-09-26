<template>
    <div v-show="albumLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="album.cover" />
                            <div class="position-absolute bottom-0">
                                <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                                    @click="play(album.id)">
                                </button>
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-4" style="font-size: 32px; font-weight: 700;">{{album.title}}</h1>
                        <div class="d-inline-flex align-content-center align-items-center mb-2">
                            <router-link :to="/artist/+album.artist_id">
                                <img class="img-fluid figure-img rounded" :src="album.artist_cover"
                                    style="width:28px;height: 28px;">
                            </router-link>
                            <router-link :to="/artist/+album.artist_id">
                                <span class="mx-2">{{album.artist_name}}</span>
                            </router-link>
                        </div>
                        <p>
                            <small class="text-muted">{{album.release_date}} - {{album.nb_tracks}} tracks -
                                {{Math.floor(album.duration /
                                60)}} mins - {{album.fans}} fans
                            </small>
                        </p>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="table-active">
                                <th scope="col">#</th>
                                <th scope="col">Track</th>
                                <th scope="col" class="bi bi-clock-fill"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(track, index) in album.tracks" :album_id="album.id" :artist_id="album.artist_id"
                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                type="albums">
                                <th scope="row">{{index+1}}</th>
                                <td><button :id="track.id" class="btn btn-link track-link"
                                        @click="playTrack($event)">{{track.title}}</button></td>
                                <td>{{Math.floor(track.duration/60)}}:{{padWithZero(track.duration % 60)}}</td>
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
import router from "../router";

const album = ref({});
const albumLoaded = ref(false);

async function get_album(id) {
    DZ.api('/album/' + id, function (response) {
        album.value = {
            id: response.id,
            title: response.title,
            artist_name: response.artist.name,
            artist_id: response.artist.id,
            artist_cover: response.artist.picture_medium,
            cover: response.cover_medium,
            duration: response.duration,
            explicit_lyrics: response.explicit_lyrics,
            fans: numberWithCommas(response.fans),
            nb_tracks: response.nb_tracks,
            release_date: formatDate(response.release_date),
            tracks: response.tracks.data
        }
        albumLoaded.value = true;
    });
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

async function playTrack(event) {
    DZ.player.playTracks([parseInt(event.target.id)]);
}

async function play(id) {
    DZ.player.playAlbum(id);
}

onMounted(() => {
    get_album(router.currentRoute.value.params.id);
})
</script>
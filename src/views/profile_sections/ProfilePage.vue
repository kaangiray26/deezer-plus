<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/history">Listening history
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/tracks">Favorite Tracks
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/playlists">Playlists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/albums">Albums
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/artists">Artists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/following">Following
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/followers">Followers
            </router-link>
        </li>
    </ul>
    <hr />
    <div v-show="chartsLoaded">
        <div class="d-inline-flex flex-column">
            <h2 class="fw-bolder mb-4" style="font-size: 22px; font-weight: 600;">Highlights</h2>
        </div>
        <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="item in charts.tracks">
                <TrackRecommendation :id="item.id" :track_id="item.id" :duration="item.duration" :title="item.title"
                    :artist="item.artist" :album="item.album" :cover="item.album.cover_medium"
                    @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                </TrackRecommendation>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TrackRecommendation from "../TrackRecommendation.vue";

const emit = defineEmits(["right-click"]);

const chartsLoaded = ref(false);
const charts = ref({
    tracks: []
});

async function get_charts_tracks() {
    DZ.api(`/user/me/charts/tracks?access_token=${localStorage.getItem("token")}`, function (response) {
        charts.value.tracks = response.data;
    });
    chartsLoaded.value = true;
}

onMounted(() => {
    DZ.api(`/user/me/options?access_token=${localStorage.getItem("token")}`, function (response) {
        console.log(response);
    });
    get_charts_tracks();
})
</script>
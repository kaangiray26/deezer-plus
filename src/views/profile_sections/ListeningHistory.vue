<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" to="/profile/history">Listening history
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/tracks">Favourite Tracks
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
    </ul>
    <hr />
    <ul v-show="historyLoaded" class="list-group">
        <li class="list-group-item">
            <div class="table-responsive">
                <table class="table table-hover table-borderless">
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-6">Track</th>
                            <th class="col-2">Artist</th>
                            <th class="col-3">Album</th>
                            <th class="col-1 bi bi-clock-fill"></th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <TrackResult v-for="item in history.tracks" :id="item.track.id" :cover="item.cover"
                            :artist="item.artist" :album="item.album" :track="item.track" :duration="item.duration"
                            @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                        </TrackResult>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TrackResult from "/components/results/TrackResult.vue";

const historyLoaded = ref(false);
const searchFinished = ref(true);

const history = ref({
    tracks: []
});

const next = ref({
    tracks: "",
});

async function get_history() {
    DZ.api(`/user/me/history?access_token=${localStorage.getItem("token")}`, function (response) {
        next.value.tracks = response.next;
        response.data.map(handleTrackSearchResponse);
    });
    historyLoaded.value = true;
}

async function next_search() {
    searchFinished.value = false;
    if (next.value.tracks) {
        DZ.api(next.value.tracks.split("https://api.deezer.com")[1], function (response) {
            response.data.map(handleTrackSearchResponse);
            if (response.next) {
                next.value.tracks = response.next;
                searchFinished.value = true;
            } else {
                next.value.tracks = null;
            }
            return;
        });
    }
    searchFinished.value = true;
}

function handleTrackSearchResponse(item) {
    history.value.tracks.push({
        cover: item.album.cover_small,
        duration: item.duration,
        artist: {
            "id": parseInt(item.artist.id),
            "title": item.artist.name,
        },
        album: {
            "id": parseInt(item.album.id),
            "title": item.album.title,
        },
        track: {
            "id": parseInt(item.id),
            "title": item.title,
        },
    })
    return;
}

window.onscroll = () => {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && searchFinished.value) {
        next_search();
    }
};

onMounted(() => {
    get_history();
})
</script>
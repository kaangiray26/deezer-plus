<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/history">Listening history
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" to="/profile/tracks">Favorite Tracks
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
    <ul v-show="lovedLoaded" class="list-group">
        <li class="list-group-item">
            <div class="table-responsive">
                <table class="table table-hover table-borderless caption-top">
                    <caption>
                        <span class="badge bg-primary">
                            {{      track_total      }} results
                        </span>
                    </caption>
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-6 d-flex align-items-center">Track</th>
                            <th class="col-2 d-flex align-items-center">Artist</th>
                            <th class="col-3 d-flex align-items-center">Album</th>
                            <th class="col-1 bi bi-clock-fill d-flex align-items-center justify-content-end"></th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <TrackResult v-for="item in loved.tracks" :id="item.track.id" :cover="item.cover"
                            :artist="item.artist" :album="item.album" :track="item.track" :duration="item.duration"
                            @contextmenu.prevent="emit('right-click', {      'event':      $event, 'target':      $event.currentTarget      })">
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

const emit = defineEmits(["right-click"]);

const lovedLoaded = ref(false);
const searchFinished = ref(true);

const track_total = ref(0);

const loved = ref({
    tracks: []
});

const next = ref({
    tracks: "",
});

async function get_loved() {
    DZ.api(`/user/me/tracks?access_token=${localStorage.getItem("token")}`, function (response) {
        track_total.value = response.total;
        next.value.tracks = response.next;
        response.data.map(handleTrackSearchResponse);
    });
    lovedLoaded.value = true;
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
    loved.value.tracks.push({
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

onMounted(() => {
    get_loved();

    let content_view = document.querySelector('.content-view');
    content_view.addEventListener("scroll", function () {
        if ((content_view.scrollTop >= content_view.scrollTopMax) && searchFinished.value) {
            next_search();
        }
    });
})
</script>
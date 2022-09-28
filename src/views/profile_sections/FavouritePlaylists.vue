<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/history">Listening history
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/tracks">Favourite Tracks
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" to="/profile/playlists">Playlists
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
    <ul v-show="lovedLoaded" class="list-group">
        <li class="list-group-item">
            <div class="table-responsive">
                <table class="table table-hover table-borderless caption-top">
                    <caption>
                        <span class="badge bg-primary">
                            {{playlist_total}} results
                        </span>
                    </caption>
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-6">Playlist</th>
                            <th class="col-5">User</th>
                            <th class="col-1">Tracks</th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <PlaylistResult v-for="item in loved.playlists" :id="item.playlist.id" :cover="item.cover"
                            :playlist="item.playlist" :user="item.user" :nb_tracks="item.nb_tracks"
                            @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                        </PlaylistResult>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PlaylistResult from "/components/results/PlaylistResult.vue";

const lovedLoaded = ref(false);
const searchFinished = ref(true);

const playlist_total = ref(0);

const loved = ref({
    playlists: []
});

const next = ref({
    playlists: "",
});

async function get_loved() {
    DZ.api(`/user/me/playlists?access_token=${localStorage.getItem("token")}`, function (response) {
        playlist_total.value = response.total;
        next.value.playlists = response.next;
        response.data.map(handlePlaylistSearchResponse);
    });
    lovedLoaded.value = true;
}

async function next_search() {
    searchFinished.value = false;
    if (next.value.playlists) {
        DZ.api(next.value.playlists.split("https://api.deezer.com")[1], function (response) {
            response.data.map(handlePlaylistSearchResponse);
            if (response.next) {
                next.value.playlists = response.next;
                searchFinished.value = true;
            } else {
                next.value.playlists = null;
            }
            return;
        });
    }
    searchFinished.value = true;
}

function handlePlaylistSearchResponse(item) {
    loved.value.playlists.push({
        cover: item.picture_medium,
        nb_tracks: item.nb_tracks,
        playlist: {
            "id": parseInt(item.id),
            "title": item.title,
        },
        user: {
            "id": parseInt(item.creator.id),
            "name": item.creator.name,
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
    get_loved();
})
</script>
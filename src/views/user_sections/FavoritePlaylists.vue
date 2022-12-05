<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/' + user_id + '/tracks'">Favorite
                Tracks
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" :to="'/user/' + user_id + '/playlists'">Playlists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/' + user_id + '/albums'">Albums
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/' + user_id + '/artists'">Artists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/' + user_id + '/following'">Following
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/' + user_id + '/followers'">Followers
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
                            {{ playlist_total }} results
                        </span>
                    </caption>
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-6 d-flex align-items-center">Playlist</th>
                            <th class="col-5 d-flex align-items-center">User</th>
                            <th class="col-1 d-flex align-items-center">Tracks</th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <PlaylistResult v-for="item in loved.playlists" :id="item.playlist.id" :cover="item.cover"
                            :playlist="item.playlist" :user="item.user" :nb_tracks="item.nb_tracks"
                            @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                        </PlaylistResult>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "/router";
import PlaylistResult from "/components/results/PlaylistResult.vue";

const emit = defineEmits(["right-click"]);

const lovedLoaded = ref(false);
const searchFinished = ref(true);

const user_id = ref(0);

const playlist_total = ref(0);

const loved = ref({
    playlists: []
});

const next = ref({
    playlists: "",
});

async function get_loved(id) {
    DZ.api(`/user/${id}/playlists?access_token=${localStorage.getItem("token")}`, function (response) {
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

onMounted(() => {
    user_id.value = router.currentRoute.value.params.id;
    get_loved(router.currentRoute.value.params.id);

    let content_view = document.querySelector('.content-view');
    content_view.addEventListener("scroll", function () {
        if ((content_view.scrollTop >= content_view.scrollTopMax) && searchFinished.value) {
            next_search();
        }
    });
});
</script>
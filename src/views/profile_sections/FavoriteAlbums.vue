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
            <router-link class="nav-link active fw-bolder" to="/profile/albums">Albums
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
                            {{album_total}} results
                        </span>
                    </caption>
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-6">Track</th>
                            <th class="col-4">Artist</th>
                            <th class="col-1">Tracks</th>
                            <th class="col-1 bi-explicit-fill"></th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <AlbumResult v-for="item in loved.albums" :id="item.album.id" :cover="item.cover"
                            :artist="item.artist" :album="item.album" :nb_tracks="item.nb_tracks"
                            :explicit_lyrics="item.explicit_lyrics"
                            @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                        </AlbumResult>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlbumResult from "/components/results/AlbumResult.vue";

const lovedLoaded = ref(false);
const searchFinished = ref(true);

const album_total = ref(0);

const loved = ref({
    albums: []
});

const next = ref({
    albums: "",
});

async function get_loved() {
    DZ.api(`/user/me/albums?access_token=${localStorage.getItem("token")}`, function (response) {
        album_total.value = response.total;
        next.value.albums = response.next;
        response.data.map(handleAlbumSearchResponse);
    });
    lovedLoaded.value = true;
}

async function next_search() {
    searchFinished.value = false;
    if (next.value.albums) {
        DZ.api(next.value.albums.split("https://api.deezer.com")[1], function (response) {
            response.data.map(handleAlbumSearchResponse);
            if (response.next) {
                next.value.albums = response.next;
                searchFinished.value = true;
            } else {
                next.value.albums = null;
            }
            return;
        });
    }
    searchFinished.value = true;
}

function handleAlbumSearchResponse(item) {
    loved.value.albums.push({
        cover: item.cover_xl,
        nb_tracks: item.nb_tracks,
        explicit_lyrics: item.explicit_lyrics,
        artist: {
            "id": parseInt(item.artist.id),
            "title": item.artist.name,
        },
        album: {
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
    get_loved();
})
</script>
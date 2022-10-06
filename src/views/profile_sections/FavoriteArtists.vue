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
            <router-link class="nav-link active fw-bolder" to="/profile/artists">Artists
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
                            {{artist_total}} results
                        </span>
                    </caption>
                    <thead>
                        <tr class="row gx-0 table-active" style="width: 100% !important;">
                            <th class="col-10">Artist</th>
                            <th class="col-1">Albums</th>
                            <th class="col-1">Fans</th>
                        </tr>
                    </thead>
                    <tbody @scroll.passive="onScroll($event)">
                        <ArtistResult v-for="item in loved.artists" :id="item.artist.id" :cover="item.cover"
                            :artist="item.artist" :nb_album="item.nb_album" :nb_fan="item.nb_fan"
                            @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                        </ArtistResult>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ArtistResult from "/components/results/ArtistResult.vue";

const lovedLoaded = ref(false);
const searchFinished = ref(true);

const artist_total = ref(0);

const loved = ref({
    artists: []
});

const next = ref({
    artists: "",
});

async function get_loved() {
    DZ.api(`/user/me/artists?access_token=${localStorage.getItem("token")}`, function (response) {
        artist_total.value = response.total;
        next.value.artists = response.next;
        response.data.map(handleArtistSearchResponse);
    });
    lovedLoaded.value = true;
}

async function next_search() {
    searchFinished.value = false;
    if (next.value.artists) {
        DZ.api(next.value.artists.split("https://api.deezer.com")[1], function (response) {
            response.data.map(handleArtistSearchResponse);
            if (response.next) {
                next.value.artists = response.next;
                searchFinished.value = true;
            } else {
                next.value.artists = null;
            }
            return;
        });
    }
    searchFinished.value = true;
}

function handleArtistSearchResponse(item) {
    loved.value.artists.push({
        cover: item.picture_xl,
        nb_album: item.nb_album,
        nb_fan: numberWithCommas(item.nb_fan),
        artist: {
            "id": parseInt(item.id),
            "title": item.name,
        },
    })
    return;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
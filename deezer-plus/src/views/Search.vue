<template>
    <div class="row justify-content-center gx-0">
        <div class="col-11">
            <div>
                <ul class="nav nav-pills my-2" role="tablist">
                    <li class="nav-item" role="presentation"><a id="tracks-tab" class="nav-link active" role="tab"
                            data-bs-toggle="tab" href="#tab-tracks" @click="currentSearchField='tracks'">Tracks<span
                                class=" badge bg-secondary
                                ms-2">{{track_total}}</span></a>
                    </li>
                    <li class="nav-item" role="presentation"><a id="albums-tab" class="nav-link" role="tab"
                            data-bs-toggle="tab" href="#tab-albums" @click="currentSearchField='albums'">Albums<span
                                class="badge bg-secondary ms-2">{{album_total}}</span></a></li>
                    <li class="nav-item" role="presentation"><a id="artists-tab" class="nav-link" role="tab"
                            data-bs-toggle="tab" href="#tab-artists" @click="currentSearchField='artists'">Artists<span
                                class="badge bg-secondary ms-2">{{artist_total}}</span></a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div id="tab-tracks" class="tab-pane active" role="tabpanel">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <div class="table-responsive">
                                    <table class="table table-hover table-borderless">
                                        <thead>
                                            <tr class="table-active">
                                                <th>Track</th>
                                                <th>Artist</th>
                                                <th>Album</th>
                                                <th class="bi bi-clock-fill"></th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="item in results.tracks" @scroll.passive="onScroll($event)">
                                            <TrackResult :id="item.track.id" :cover="item.cover" :artist="item.artist"
                                                :album="item.album" :track="item.track" :duration="item.duration"
                                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                                @route-click="searchVisible=false">
                                            </TrackResult>
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="tab-albums" class="tab-pane" role="tabpanel">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <div class="table-responsive">
                                    <table class="table table-hover table-borderless"
                                        style="table-layout: fixed; width: 100%;">
                                        <thead>
                                            <tr class="table-active text-end">
                                                <th>Album</th>
                                                <th>Artist</th>
                                                <th>Tracks</th>
                                                <th class="bi bi-explicit-fill"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AlbumResult v-for="item in results.albums"
                                                @scroll.passive="onScroll($event)" :id="item.album.id"
                                                :cover="item.cover" :artist="item.artist" :album="item.album"
                                                :nb_tracks="item.nb_tracks" :explicit_lyrics="item.explicit_lyrics"
                                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                                @route-click="searchVisible=false">
                                            </AlbumResult>
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="tab-artists" class="tab-pane" role="tabpanel">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <div class="table-responsive">
                                    <table class="table table-hover table-borderless">
                                        <thead>
                                            <tr class="table-active">
                                                <th>Artist</th>
                                                <th>Tracks</th>
                                                <th>Fans</th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="item in results.artists" @scroll.passive="onScroll($event)">
                                            <ArtistResult :id="item.artist.id" :cover="item.cover" :artist="item.artist"
                                                :nb_album="item.nb_album" :nb_fan="item.nb_fan"
                                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                                @route-click="searchVisible=false">
                                            </ArtistResult>
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";

import TrackResult from "../components/results/TrackResult.vue";
import ArtistResult from "../components/results/ArtistResult.vue";
import AlbumResult from "../components/results/AlbumResult.vue";

const query = ref(null);

const next = ref({
    tracks: "",
    albums: "",
    artists: "",
});

const track_total = ref(0);
const album_total = ref(0);
const artist_total = ref(0);

const searchVisible = ref(false);
const searchFinished = ref(true);
const currentSearchField = ref("tracks");

const results = ref({
    tracks: [],
    albums: [],
    artists: [],
    releases: [],
    playlists: [],
    radios: []
});

async function track_search() {
    results.value.tracks = [];
    DZ.api(`/search/track?q=${query.value}&access_token=${sessionStorage.getItem("token")}`, function (response) {
        track_total.value = response.total;
        next.value.tracks = response.next;
        response.data.map(handleTrackSearchResponse);
    });
}

async function album_search() {
    results.value.albums = [];
    DZ.api(`/search/album?q=${query.value}&access_token=${sessionStorage.getItem("token")}`, function (response) {
        album_total.value = response.total;
        next.value.albums = response.next;
        response.data.map(handleAlbumSearchResponse);
    });
}

async function artist_search() {
    results.value.artists = [];
    DZ.api(`/search/artist?q=${query.value}&access_token=${sessionStorage.getItem("token")}`, function (response) {
        artist_total.value = response.total;
        next.value.artists = response.next;
        response.data.map(handleArtistSearchResponse);
    });
}

async function next_search() {
    searchFinished.value = false;
    if (currentSearchField.value === "tracks" && next.value.tracks) {
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
    if (currentSearchField.value === "albums" && next.value.albums) {
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
    if (currentSearchField.value === "artists" && next.value.artists) {
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

function handleTrackSearchResponse(item) {
    results.value.tracks.push({
        cover: item.album.cover_small,
        artist: {
            "id": (item.artist.id),
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
        duration: item.duration
    })
    return;
}

function handleAlbumSearchResponse(item) {
    results.value.albums.push({
        artist: {
            "id": parseInt(item.artist.id),
            "title": item.artist.name,
        },
        album: {
            "id": parseInt(item.id),
            "title": item.title,
        },
        cover: item.cover_xl,
        nb_tracks: item.nb_tracks,
        explicit_lyrics: item.explicit_lyrics,
    })
    return;
}

function handleArtistSearchResponse(item) {
    results.value.artists.push({
        artist: {
            "id": parseInt(item.id),
            "title": item.name,
        },
        cover: item.picture_xl,
        nb_album: item.nb_album,
        nb_fan: numberWithCommas(item.nb_fan),
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
    query.value = router.currentRoute.value.params.query;
    track_search();
    album_search();
    artist_search();
})
</script>
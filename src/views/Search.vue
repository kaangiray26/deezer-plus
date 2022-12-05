<template>
    <div class="row justify-content-center gx-0">
        <div class="col-11">
            <div>
                <ul class="nav nav-pills my-2" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a id="tracks-tab" class="nav-link active" role="tab" data-bs-toggle="tab" href="#tab-tracks"
                            @click="currentSearchField = 'tracks'">Tracks
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a id="albums-tab" class="nav-link" role="tab" data-bs-toggle="tab" href="#tab-albums"
                            @click="currentSearchField = 'albums'">Albums
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a id="artists-tab" class="nav-link" role="tab" data-bs-toggle="tab" href="#tab-artists"
                            @click="currentSearchField = 'artists'">Artists
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a id="playlists-tab" class="nav-link" role="tab" data-bs-toggle="tab" href="#tab-playlists"
                            @click="currentSearchField = 'playlists'">Playlist
                        </a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div id="tab-tracks" class="tab-pane active" role="tabpanel">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <div class="table-responsive">
                                    <table class="table table-hover table-borderless caption-top">
                                        <caption>
                                            <span class="badge bg-primary">
                                                {{ track_total }} results
                                            </span>
                                        </caption>
                                        <thead>
                                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                                <th class="col-6 d-flex align-items-center">Track</th>
                                                <th class="col-2 d-flex align-items-center">Artist</th>
                                                <th class="col-2 d-flex align-items-center">Album</th>
                                                <th
                                                    class="col-1 d-flex align-items-center justify-content-end bi bi-clock-fill">
                                                </th>
                                                <th class="col-1 d-flex align-items-center justify-content-end">
                                                    <button class="btn btn-light bi bi-heart-fill disabled"
                                                        type="button" style="opacity: 0.90;">
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody @scroll.passive="onScroll($event)">
                                            <TrackResult v-for="item in results.tracks" :id="item.track.id"
                                                :cover="item.cover" :artist="item.artist" :album="item.album"
                                                :track="item.track" :duration="item.duration"
                                                @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                            </TrackResult>
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="tab-playlists" class="tab-pane" role="tabpanel">
                        <ul class="list-group">
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
                                                <th class="col-4 d-flex align-items-center">User</th>
                                                <th class="col-1 d-flex align-items-center">Tracks</th>
                                                <th class="col-1 d-flex align-items-center justify-content-end">
                                                    <button class="btn btn-light bi bi-heart-fill disabled"
                                                        type="button" style="opacity: 0.90;">
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody @scroll.passive="onScroll($event)">
                                            <PlaylistResult v-for="item in results.playlists" :id="item.playlist.id"
                                                :cover="item.cover" :playlist="item.playlist" :user="item.user"
                                                :nb_tracks="item.nb_tracks"
                                                @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                            </PlaylistResult>
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
                                    <table class="table table-hover table-borderless caption-top">
                                        <caption>
                                            <span class="badge bg-primary">
                                                {{ album_total }} results
                                            </span>
                                        </caption>
                                        <thead>
                                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                                <th class="col-6 d-flex align-items-center">Album</th>
                                                <th class="col-3 d-flex align-items-center">Artist</th>
                                                <th class="col-1 d-flex align-items-center">Tracks</th>
                                                <th class="col-1 d-flex align-items-center bi bi-explicit-fill">
                                                </th>
                                                <th class="col-1 d-flex align-items-center justify-content-end">
                                                    <button class="btn btn-light bi bi-heart-fill disabled"
                                                        type="button" style="opacity: 0.90;">
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody @scroll.passive="onScroll($event)">
                                            <AlbumResult v-for="item in results.albums" :id="item.album.id"
                                                :cover="item.cover" :artist="item.artist" :album="item.album"
                                                :nb_tracks="item.nb_tracks" :explicit_lyrics="item.explicit_lyrics"
                                                @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
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
                                    <table class="table table-hover table-borderless caption-top">
                                        <caption>
                                            <span class="badge bg-primary">
                                                {{ artist_total }} results
                                            </span>
                                        </caption>
                                        <thead>
                                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                                <th class="col-9 d-flex align-items-center">Artist</th>
                                                <th class="col-1 d-flex align-items-center">Albums</th>
                                                <th class="col-1 d-flex align-items-center">Fans</th>
                                                <th class="col-1 d-flex align-items-center justify-content-end">
                                                    <button class="btn btn-light bi bi-heart-fill disabled"
                                                        type="button" style="opacity: 0.90;">
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody @scroll.passive="onScroll($event)">
                                            <ArtistResult v-for="item in results.artists" :id="item.artist.id"
                                                :cover="item.cover" :artist="item.artist" :nb_album="item.nb_album"
                                                :nb_fan="item.nb_fan"
                                                @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
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
import { ref, watch, computed, onMounted } from "vue";
import router from "/router";

import TrackResult from "/components/results/TrackResultFav.vue";
import PlaylistResult from "/components/results/PlaylistResultFav.vue";
import ArtistResult from "/components/results/ArtistResultFav.vue";
import AlbumResult from "/components/results/AlbumResultFav.vue";

const emit = defineEmits(["right-click"]);

const query = ref(null);

const query_param = computed(() => {
    return router.currentRoute.value.params.query;
})

const next = ref({
    tracks: "",
    albums: "",
    artists: "",
    playlists: ""
});

const track_total = ref(0);
const album_total = ref(0);
const artist_total = ref(0);
const playlist_total = ref(0);

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
    DZ.api(`/search/track?q=${query.value}&access_token=${localStorage.getItem("token")}`, function (response) {
        track_total.value = response.total;
        next.value.tracks = response.next;
        response.data.map(handleTrackSearchResponse);
    });
}

async function album_search() {
    results.value.albums = [];
    DZ.api(`/search/album?q=${query.value}&access_token=${localStorage.getItem("token")}`, function (response) {
        album_total.value = response.total;
        next.value.albums = response.next;
        response.data.map(handleAlbumSearchResponse);
    });
}

async function artist_search() {
    results.value.artists = [];
    DZ.api(`/search/artist?q=${query.value}&access_token=${localStorage.getItem("token")}`, function (response) {
        artist_total.value = response.total;
        next.value.artists = response.next;
        response.data.map(handleArtistSearchResponse);
    });
}

async function playlist_search() {
    results.value.playlists = [];
    DZ.api(`/search/playlist?q=${query.value}&access_token=${localStorage.getItem("token")}`, function (response) {
        playlist_total.value = response.total;
        next.value.playlists = response.next;
        response.data.map(handlePlaylistSearchResponse);
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
    if (currentSearchField.value === "playlists" && next.value.playlists) {
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

function handleTrackSearchResponse(item) {
    results.value.tracks.push({
        cover: item.album.cover_medium,
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

function handleAlbumSearchResponse(item) {
    results.value.albums.push({
        cover: item.cover_medium,
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

function handleArtistSearchResponse(item) {
    results.value.artists.push({
        cover: item.picture_medium,
        nb_album: item.nb_album,
        nb_fan: numberWithCommas(item.nb_fan),
        artist: {
            "id": parseInt(item.id),
            "title": item.name,
        },
    })
    return;
}

function handlePlaylistSearchResponse(item) {
    results.value.playlists.push({
        cover: item.picture_medium,
        nb_tracks: item.nb_tracks,
        playlist: {
            "id": parseInt(item.id),
            "title": item.title,
        },
        user: {
            "id": parseInt(item.user.id),
            "name": item.user.name,
        },
    })
    return;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function search() {
    query.value = router.currentRoute.value.params.query;
    track_search();
    playlist_search();
    album_search();
    artist_search();
}

watch(query_param, () => {
    search();
});

onMounted(() => {
    search();

    let content_view = document.querySelector('.content-view');
    content_view.addEventListener("scroll", function () {
        if ((content_view.scrollTop >= content_view.scrollTopMax) && searchFinished.value) {
            next_search();
        }
    });
});
</script>